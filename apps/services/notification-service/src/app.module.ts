import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './notification-service.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [NotificationController],
})
export class AppModule {}
