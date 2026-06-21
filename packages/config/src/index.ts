// ============================================================================
// Zod-validated env config. Fail fast at boot if required vars are missing.
// ============================================================================
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.string().default('development'),
  LOG_LEVEL: z.string().default('info'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  KAFKA_BROKERS: z.string().default('localhost:9092'),
  KAFKA_CLIENT_ID: z.string().default('jobhunter'),
  JWT_ACCESS_TTL: z.coerce.number().default(900),
  JWT_REFRESH_TTL: z.coerce.number().default(2592000),
  OTP_TTL: z.coerce.number().default(600),
});

export type AppConfig = z.infer<typeof schema>;

/** Parse + validate process.env. Throws (with field detail) on misconfig. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = schema.safeParse(env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`[config] invalid environment: ${issues}`);
  }
  return parsed.data;
}
