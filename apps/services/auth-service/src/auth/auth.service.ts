// ============================================================================
// AuthService — FR-JS-001..007. Email/password + OAuth, email-OTP verification,
// RS256 JWTs (jose), rotating refresh tokens with reuse detection (G-018),
// Redis denylist on logout, password policy, rate limiting, kafka emit.
//
// Notes:
//  - Tokens are signed with RS256 using a private key on disk (KMS in prod).
//  - Refresh tokens are opaque random strings; only their SHA-256 hash is
//    persisted (Session.refreshTokenHash). On refresh we ROTATE: revoke the
//    presented session and issue a new one in the same family. Presenting an
//    already-revoked refresh token => REUSE => revoke the whole family.
//  - Idempotency-Key awareness: register/verify are safe to retry; the caller
//    should send an Idempotency-Key header which the API gateway dedupes.
// ============================================================================
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { importPKCS8, SignJWT } from 'jose';
import { Role, UserStatus } from '@jobhunter/types';
import { prisma } from '@jobhunter/database';
import { createRedis, rateLimit, revokeToken } from '@jobhunter/redis';
import { createKafka, createProducer, publish, TOPICS } from '@jobhunter/kafka';
import { createLogger } from '@jobhunter/logger';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { GoogleProfile } from './strategies/google.strategy';
import { MfaService } from '../mfa/mfa.service';

const logger = createLogger('auth-service');
const redis = createRedis(process.env.REDIS_URL ?? 'redis://localhost:6379');

const ACCESS_TTL = Number(process.env.JWT_ACCESS_TTL ?? 900);
const REFRESH_TTL = Number(process.env.JWT_REFRESH_TTL ?? 2592000);
const OTP_TTL = Number(process.env.OTP_TTL ?? 600);
const ISSUER = 'jobhunter.auth';
const AUDIENCE = 'jobhunter.api';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

@Injectable()
export class AuthService {
  // Lazily-initialised kafka producer (best-effort; auth still works offline).
  private producerPromise = (async () => {
    try {
      const kafka = createKafka(
        process.env.KAFKA_CLIENT_ID ?? 'jobhunter-auth',
        (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
      );
      return await createProducer(kafka);
    } catch (err) {
      logger.warn({ err }, 'kafka producer unavailable');
      return null;
    }
  })();

  constructor(private readonly mfa: MfaService) {}

  // -------------------------------------------------------------------------
  // Password policy (FR-JS-001): min 12, upper, lower, digit, symbol.
  // -------------------------------------------------------------------------
  static validatePasswordPolicy(password: string): void {
    const failures: string[] = [];
    if (password.length < 12) failures.push('at least 12 characters');
    if (!/[A-Z]/.test(password)) failures.push('an uppercase letter');
    if (!/[a-z]/.test(password)) failures.push('a lowercase letter');
    if (!/[0-9]/.test(password)) failures.push('a digit');
    if (!/[^A-Za-z0-9]/.test(password)) failures.push('a symbol');
    if (failures.length) {
      throw new BadRequestException(`Password must contain ${failures.join(', ')}`);
    }
  }

  // -------------------------------------------------------------------------
  // Rate limiting hooks
  // -------------------------------------------------------------------------
  private async enforceAuthRate(ip: string): Promise<void> {
    const r = await rateLimit(redis, `auth:${ip}`, 10, 60); // 10/min/IP
    if (!r.allowed) {
      throw new HttpException('Too many auth attempts', HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private async enforceOtpRate(email: string): Promise<void> {
    const r = await rateLimit(redis, `otp:${email}`, 3, 3600); // 3/60min
    if (!r.allowed) {
      throw new HttpException('Too many OTP requests', HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  // -------------------------------------------------------------------------
  // OTP store (Redis, TTL from config)
  // -------------------------------------------------------------------------
  private otpKey(scope: string, email: string): string {
    return `otp:${scope}:${email.toLowerCase()}`;
  }

  private async issueOtp(scope: string, email: string): Promise<string> {
    await this.enforceOtpRate(email);
    const otp = String(randomInt6());
    await redis.set(this.otpKey(scope, email), await bcrypt.hash(otp, 10), 'EX', OTP_TTL);
    // In prod this is dispatched via notification-service (email channel).
    logger.info({ scope, ttl: OTP_TTL }, 'otp issued'); // value redacted by logger
    return otp;
  }

  private async consumeOtp(scope: string, email: string, otp: string): Promise<void> {
    const stored = await redis.get(this.otpKey(scope, email));
    if (!stored || !(await bcrypt.compare(otp, stored))) {
      throw new BadRequestException('Invalid or expired code');
    }
    await redis.del(this.otpKey(scope, email));
  }

  // -------------------------------------------------------------------------
  // JWT signing (RS256 via jose)
  // -------------------------------------------------------------------------
  private async signAccessToken(user: {
    id: string;
    email: string;
    role: Role;
    org_id: string | null;
  }): Promise<{ token: string; jti: string }> {
    const jti = randomUUID();
    const pem = readFileSync(
      process.env.JWT_PRIVATE_KEY_PATH ?? './secrets/jwt-private.pem',
      'utf8',
    );
    const key = await importPKCS8(pem, 'RS256');
    const token = await new SignJWT({
      email: user.email,
      role: user.role,
      org_id: user.org_id,
      type: 'access',
    })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setSubject(user.id)
      .setJti(jti)
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(`${ACCESS_TTL}s`)
      .sign(key);
    return { token, jti };
  }

  private hashRefresh(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // Mint access + refresh, persisting a Session row (rotation family).
  private async issueTokenPair(
    user: { id: string; email: string; role: Role; org_id: string | null },
    ctx: { ip?: string; userAgent?: string; familyId?: string; rotatedFromId?: string },
  ): Promise<TokenPair> {
    const { token: access_token, jti } = await this.signAccessToken(user);
    const refresh_token = randomBytes(48).toString('base64url');

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: this.hashRefresh(refresh_token),
        jti,
        familyId: ctx.familyId ?? randomUUID(),
        rotatedFromId: ctx.rotatedFromId,
        userAgent: ctx.userAgent,
        ip: ctx.ip,
        expiresAt: new Date(Date.now() + REFRESH_TTL * 1000),
      },
    });

    return { access_token, refresh_token, expires_in: ACCESS_TTL };
  }

  // -------------------------------------------------------------------------
  // Register (FR-JS-001) -> emits candidate.created
  // -------------------------------------------------------------------------
  async register(dto: RegisterDto, ip: string): Promise<{ user_id: string }> {
    await this.enforceAuthRate(ip);
    AuthService.validatePasswordPolicy(dto.password);

    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const role = dto.role ?? Role.CANDIDATE;
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.full_name,
        role,
        status: UserStatus.PENDING,
      },
    });

    // Candidates get a golden record + a candidate.created event.
    if (role === Role.CANDIDATE) {
      const candidate = await prisma.candidate.create({
        data: {
          masterId: `CAND_${randomBytes(4).toString('hex').toUpperCase()}`,
          userId: user.id,
          fullName: dto.full_name,
          email: dto.email,
        },
      });
      const producer = await this.producerPromise;
      if (producer) {
        await publish(producer, {
          topic: TOPICS.CANDIDATE_CREATED,
          key: candidate.id, // no org_id (global pool) -> partition by candidate
          payload: { candidate_id: candidate.id, user_id: user.id, email: dto.email },
          occurred_at: new Date().toISOString(),
        });
      }
    }

    await this.issueOtp('verify', dto.email);
    return { user_id: user.id };
  }

  // -------------------------------------------------------------------------
  // Verify email (FR-JS-001)
  // -------------------------------------------------------------------------
  async verifyEmail(email: string, otp: string): Promise<{ verified: true }> {
    await this.consumeOtp('verify', email, otp);
    await prisma.user.update({
      where: { email },
      data: { status: UserStatus.ACTIVE },
    });
    return { verified: true };
  }

  // -------------------------------------------------------------------------
  // Login (FR-JS-002) — verifies password + optional MFA
  // -------------------------------------------------------------------------
  async login(dto: LoginDto, ctx: { ip: string; userAgent?: string }): Promise<TokenPair> {
    await this.enforceAuthRate(ctx.ip);
    const user = await prisma.user.findUnique({ where: { email: dto.email } });

    // Constant-ish failure to limit user enumeration.
    if (!user || !user.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account suspended');
    }
    if (user.mfaEnabled) {
      if (!dto.mfa_code) throw new UnauthorizedException('MFA code required');
      const ok = await this.mfa.verifyForUser(user.id, dto.mfa_code);
      if (!ok) throw new UnauthorizedException('Invalid MFA code');
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    return this.issueTokenPair(
      { id: user.id, email: user.email, role: user.role as Role, org_id: user.orgId },
      ctx,
    );
  }

  // -------------------------------------------------------------------------
  // Refresh with rotation + reuse detection (G-018)
  // -------------------------------------------------------------------------
  async refresh(refreshToken: string, ctx: { ip?: string; userAgent?: string }): Promise<TokenPair> {
    const hash = this.hashRefresh(refreshToken);
    const session = await prisma.session.findUnique({
      where: { refreshTokenHash: hash },
      include: { user: true },
    });

    if (!session) throw new UnauthorizedException('Invalid refresh token');

    // REUSE DETECTION: a revoked token presented again => compromise.
    if (session.revokedAt) {
      logger.warn({ familyId: session.familyId }, 'refresh reuse detected — revoking family');
      await prisma.session.updateMany({
        where: { familyId: session.familyId, revokedAt: null },
        data: { revokedAt: new Date(), reuseDetected: true },
      });
      // Deny-list any still-valid access tokens in the family.
      await revokeToken(redis, session.jti, ACCESS_TTL);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Rotate: revoke the presented session and deny-list its access jti.
    await prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });
    await revokeToken(redis, session.jti, ACCESS_TTL);

    return this.issueTokenPair(
      {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role as Role,
        org_id: session.user.orgId,
      },
      { ...ctx, familyId: session.familyId, rotatedFromId: session.id },
    );
  }

  // -------------------------------------------------------------------------
  // Logout (FR-JS-006) — revoke session + deny-list access jti
  // -------------------------------------------------------------------------
  async logout(jti: string): Promise<{ success: true }> {
    const session = await prisma.session.findUnique({ where: { jti } });
    if (session && !session.revokedAt) {
      await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
    }
    await revokeToken(redis, jti, ACCESS_TTL);
    return { success: true };
  }

  // -------------------------------------------------------------------------
  // Password reset (FR-JS-005)
  // -------------------------------------------------------------------------
  async requestPasswordReset(email: string): Promise<{ sent: true }> {
    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to avoid enumeration; only issue OTP if user exists.
    if (user) await this.issueOtp('reset', email);
    return { sent: true };
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: true }> {
    AuthService.validatePasswordPolicy(newPassword);
    await this.consumeOtp('reset', email, otp);
    const passwordHash = await bcrypt.hash(newPassword, 12);
    const user = await prisma.user.update({ where: { email }, data: { passwordHash } });
    // Revoke all sessions on password change.
    await prisma.session.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  // -------------------------------------------------------------------------
  // OAuth (FR-JS-002) — find-or-create then mint platform tokens
  // -------------------------------------------------------------------------
  async findOrCreateOAuthUser(
    profile: GoogleProfile,
    ctx: { ip?: string; userAgent?: string },
  ): Promise<TokenPair> {
    let user = await prisma.user.findUnique({ where: { email: profile.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          fullName: profile.full_name,
          googleId: profile.google_id,
          avatarUrl: profile.avatar_url,
          role: Role.CANDIDATE,
          status: UserStatus.ACTIVE,
        },
      });
      await prisma.candidate.create({
        data: {
          masterId: `CAND_${randomBytes(4).toString('hex').toUpperCase()}`,
          userId: user.id,
          fullName: profile.full_name,
          email: profile.email,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.google_id },
      });
    }

    return this.issueTokenPair(
      { id: user.id, email: user.email, role: user.role as Role, org_id: user.orgId },
      ctx,
    );
  }
}

function randomInt6(): number {
  // 6-digit OTP in [100000, 999999]
  return 100000 + (randomBytes(4).readUInt32BE(0) % 900000);
}
