// voice-ai-service bootstrap (Port 3005).
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createLogger } from '@jobhunter/logger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response.interceptor';

const logger = createLogger('voice-ai-service');
const PORT = Number(process.env.PORT ?? 3005);

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(PORT);
  logger.info({ port: PORT }, 'voice-ai-service listening');
}

bootstrap().catch((err) => {
  logger.error({ err }, 'voice-ai-service failed to start');
  process.exit(1);
});
