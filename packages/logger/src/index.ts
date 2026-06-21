// ============================================================================
// Structured JSON logger (Tech Specs §13.1). PII MUST be redacted (§14.4).
// ============================================================================
import pino from 'pino';

/** Keys whose values are always redacted before they reach a log sink. */
const REDACT_PATHS = [
  'password',
  'otp',
  'token',
  'access_token',
  'refresh_token',
  'authorization',
  'email',
  'phone',
  'voiceprint',
  '*.password',
  '*.email',
  '*.phone',
  'req.headers.authorization',
];

export function createLogger(service: string) {
  return pino({
    name: service,
    level: process.env.LOG_LEVEL ?? 'info',
    redact: { paths: REDACT_PATHS, censor: '[REDACTED]' },
    formatters: {
      level: (label) => ({ level: label }),
    },
    base: { service, env: process.env.APP_ENV ?? 'development' },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

export type Logger = ReturnType<typeof createLogger>;
