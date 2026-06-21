import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JdController } from './jd-service.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [JdController],
})
export class AppModule {}
