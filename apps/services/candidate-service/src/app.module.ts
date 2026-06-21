import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CandidateController } from './candidate.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [CandidateController],
})
export class AppModule {}
