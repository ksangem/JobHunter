// ============================================================================
// MfaService — TOTP MFA (G-017) via otplib. Provisioning URI for authenticator
// apps + bcrypt-hashed single-use recovery codes.
// ============================================================================
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { authenticator } from 'otplib';
import { prisma } from '@jobhunter/database';

const ISSUER = 'JobHunter';

@Injectable()
export class MfaService {
  /** Generate a secret + otpauth:// URI; store as un-enabled until verified. */
  async setup(userId: string): Promise<{ secret: string; otpauth_url: string }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const secret = authenticator.generateSecret();
    const otpauth_url = authenticator.keyuri(user.email, ISSUER, secret);

    await prisma.mfaSecret.upsert({
      where: { userId },
      create: { userId, secret, enabled: false, recoveryCodes: [] },
      update: { secret, enabled: false, recoveryCodes: [] },
    });

    return { secret, otpauth_url };
  }

  /** Confirm the first TOTP code, enable MFA, and return recovery codes once. */
  async enable(userId: string, code: string): Promise<{ recovery_codes: string[] }> {
    const record = await prisma.mfaSecret.findUnique({ where: { userId } });
    if (!record) throw new BadRequestException('Run setup first');
    if (!authenticator.verify({ token: code, secret: record.secret })) {
      throw new BadRequestException('Invalid code');
    }

    const plain = Array.from({ length: 8 }, () => randomBytes(5).toString('hex'));
    const hashed = await Promise.all(plain.map((c) => bcrypt.hash(c, 10)));

    await prisma.mfaSecret.update({
      where: { userId },
      data: { enabled: true, verifiedAt: new Date(), recoveryCodes: hashed },
    });
    await prisma.user.update({ where: { id: userId }, data: { mfaEnabled: true } });

    return { recovery_codes: plain }; // shown once; never retrievable again
  }

  /** Verify a TOTP code or consume a recovery code (used at login). */
  async verifyForUser(userId: string, code: string): Promise<boolean> {
    const record = await prisma.mfaSecret.findUnique({ where: { userId } });
    if (!record || !record.enabled) return false;

    if (authenticator.verify({ token: code, secret: record.secret })) return true;

    // Fall back to recovery codes (single-use).
    for (const hash of record.recoveryCodes) {
      if (await bcrypt.compare(code, hash)) {
        await prisma.mfaSecret.update({
          where: { userId },
          data: { recoveryCodes: record.recoveryCodes.filter((h) => h !== hash) },
        });
        return true;
      }
    }
    return false;
  }

  async disable(userId: string, code: string): Promise<{ disabled: true }> {
    const ok = await this.verifyForUser(userId, code);
    if (!ok) throw new BadRequestException('Invalid code');
    await prisma.mfaSecret.delete({ where: { userId } });
    await prisma.user.update({ where: { id: userId }, data: { mfaEnabled: false } });
    return { disabled: true };
  }
}
