// admin-service bootstrap (Port 3010).
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createLogger } from '@jobhunter/logger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response.interceptor';

const logger = createLogger('admin-service');
const PORT = Number(process.env.PORT ?? 3010);

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(PORT);
  logger.info({ port: PORT }, 'admin-service listening');
}

bootstrap().catch((err) => {
  logger.error({ err }, 'admin-service failed to start');
  process.exit(1);
});
