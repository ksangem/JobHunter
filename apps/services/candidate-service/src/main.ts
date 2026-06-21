// candidate-service bootstrap (Port 3002).
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createLogger } from '@jobhunter/logger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response.interceptor';

const logger = createLogger('candidate-service');
const PORT = Number(process.env.PORT ?? 3002);

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(PORT);
  logger.info({ port: PORT }, 'candidate-service listening');
}

bootstrap().catch((err) => {
  logger.error({ err }, 'candidate-service failed to start');
  process.exit(1);
});
