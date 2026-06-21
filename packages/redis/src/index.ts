// ============================================================================
// Redis client + sliding-window rate limiter (Tech Specs §11.2). Also backs
// sessions, OTP store, and the JWT revocation denylist (FR-JS-006 / G-018).
// ============================================================================
import Redis from 'ioredis';

export function createRedis(url: string): Redis {
  return new Redis(url, { maxRetriesPerRequest: 3, enableReadyCheck: true });
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset_at: number;
}

/**
 * Fixed-window rate limit. Returns allowed=false once `limit` is exceeded
 * within `windowSec`. Used for auth (10/min/IP), OTP (3/60min), apply (50/day),
 * campaign launch (10/60min/org), etc.
 */
export async function rateLimit(
  redis: Redis,
  key: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult> {
  const redisKey = `rl:${key}`;
  const count = await redis.incr(redisKey);
  if (count === 1) await redis.expire(redisKey, windowSec);
  const ttl = await redis.ttl(redisKey);
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    reset_at: Date.now() + ttl * 1000,
  };
}

/** Add a JWT jti to the denylist until its natural expiry (logout/rotation). */
export async function revokeToken(redis: Redis, jti: string, ttlSec: number): Promise<void> {
  await redis.set(`denylist:${jti}`, '1', 'EX', ttlSec);
}

export async function isRevoked(redis: Redis, jti: string): Promise<boolean> {
  return (await redis.exists(`denylist:${jti}`)) === 1;
}
