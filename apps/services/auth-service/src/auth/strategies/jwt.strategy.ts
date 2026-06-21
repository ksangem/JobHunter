// ============================================================================
// RS256 JWT validation strategy. Verifies signature against the public key and
// rejects access tokens whose jti has been revoked (Redis denylist, FR-JS-006).
// ============================================================================
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFileSync } from 'fs';
import { createRedis, isRevoked } from '@jobhunter/redis';
import type { Role } from '@jobhunter/types';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: Role;
  org_id: string | null;
  jti: string;
  type: 'access';
}

const redis = createRedis(process.env.REDIS_URL ?? 'redis://localhost:6379');

function publicKey(): string {
  const path = process.env.JWT_PUBLIC_KEY_PATH ?? './secrets/jwt-public.pem';
  return readFileSync(path, 'utf8');
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKey: publicKey(),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') throw new UnauthorizedException('Wrong token type');
    if (await isRevoked(redis, payload.jti)) {
      throw new UnauthorizedException('Token revoked');
    }
    // Attached to req.user; consumed by RolesGuard / controllers.
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      org_id: payload.org_id,
      jti: payload.jti,
    };
  }
}
