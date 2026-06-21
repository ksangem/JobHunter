import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MfaModule } from './mfa/mfa.module';
import { HealthController } from './common/health.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, MfaModule],
  controllers: [HealthController],
})
export class AppModule {}
