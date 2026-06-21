import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VoiceController } from './voice-ai-service.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [VoiceController],
})
export class AppModule {}
