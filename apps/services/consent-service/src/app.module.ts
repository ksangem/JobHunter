import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsentController } from './consent-service.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ConsentController],
})
export class AppModule {}
