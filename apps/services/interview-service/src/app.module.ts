import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InterviewController } from './interview-service.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [InterviewController],
})
export class AppModule {}
