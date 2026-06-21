// ============================================================================
// auth-service bootstrap (Port 3001). FR-JS-001..007 + MFA (G-017) + sessions
// (G-018). Global prefix api/v1, response envelope, RFC7807 errors.
// ============================================================================
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createLogger } from '@jobhunter/logger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';

const logger = createLogger('auth-service');
const PORT = Number(process.env.PORT ?? 3001);

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({ origin: true, credentials: true });

  await app.listen(PORT);
  logger.info({ port: PORT }, 'auth-service listening');
}

bootstrap().catch((err) => {
  logger.error({ err }, 'auth-service failed to start');
  process.exit(1);
});
