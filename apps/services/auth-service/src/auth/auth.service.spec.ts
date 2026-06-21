// ============================================================================
// Unit tests for AuthService: password-policy validator + verifyEmail flow.
// Prisma / Redis are mocked so the test is self-contained (no infra needed).
// ============================================================================
import { BadRequestException } from '@nestjs/common';

// --- Mock workspace packages BEFORE importing the service under test. ---------
const prismaMock = {
  user: { update: jest.fn() },
};
const redisMock = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

jest.mock('@jobhunter/database', () => ({ prisma: prismaMock }));
jest.mock('@jobhunter/redis', () => ({
  createRedis: () => redisMock,
  rateLimit: jest.fn().mockResolvedValue({ allowed: true, remaining: 9, reset_at: 0 }),
  revokeToken: jest.fn(),
}));
jest.mock('@jobhunter/kafka', () => ({
  createKafka: jest.fn(),
  createProducer: jest.fn().mockResolvedValue(null),
  publish: jest.fn(),
  TOPICS: { CANDIDATE_CREATED: 'candidate.created' },
}));
jest.mock('@jobhunter/logger', () => ({
  createLogger: () => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() }),
}));

// bcrypt is real here (cheap enough); only the data layer is mocked.
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService.validatePasswordPolicy', () => {
  it('accepts a strong password', () => {
    expect(() => AuthService.validatePasswordPolicy('Str0ng!Passw0rd')).not.toThrow();
  });

  it.each([
    ['short', 'Aa1!aaaa'],            // < 12 chars
    ['no uppercase', 'aa1!aaaaaaaa'],
    ['no lowercase', 'AA1!AAAAAAAA'],
    ['no digit', 'Aa!aaaaaaaaa'],
    ['no symbol', 'Aa1aaaaaaaaa'],
  ])('rejects %s', (_label, pw) => {
    expect(() => AuthService.validatePasswordPolicy(pw)).toThrow(BadRequestException);
  });
});

describe('AuthService.verifyEmail', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    // MfaService is only used by login; a stub satisfies the constructor.
    service = new AuthService({ verifyForUser: jest.fn() } as any);
  });

  it('consumes a valid OTP and activates the user', async () => {
    const otp = '123456';
    redisMock.get.mockResolvedValue(await bcrypt.hash(otp, 4));
    prismaMock.user.update.mockResolvedValue({ id: 'u1' });

    const result = await service.verifyEmail('user@example.com', otp);

    expect(result).toEqual({ verified: true });
    expect(redisMock.del).toHaveBeenCalled();
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: 'user@example.com' } }),
    );
  });

  it('rejects an invalid OTP', async () => {
    redisMock.get.mockResolvedValue(await bcrypt.hash('999999', 4));
    await expect(service.verifyEmail('user@example.com', '123456')).rejects.toThrow(
      BadRequestException,
    );
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});
