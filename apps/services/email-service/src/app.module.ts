import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './email-service.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [EmailController],
})
export class AppModule {}
