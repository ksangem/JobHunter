// notification-service bootstrap (Port 3009).
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createLogger } from '@jobhunter/logger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response.interceptor';

const logger = createLogger('notification-service');
const PORT = Number(process.env.PORT ?? 3009);

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(PORT);
  logger.info({ port: PORT }, 'notification-service listening');
}

bootstrap().catch((err) => {
  logger.error({ err }, 'notification-service failed to start');
  process.exit(1);
});
