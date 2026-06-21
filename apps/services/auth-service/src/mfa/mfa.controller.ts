// ============================================================================
// MfaController — MFA management (G-017). All routes require a valid access
// token (the user enabling MFA must already be authenticated).
// ============================================================================
import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { IsString, Length } from 'class-validator';
import { MfaService } from './mfa.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class MfaCodeDto {
  @IsString()
  @Length(6, 12) // 6-digit TOTP or a recovery code
  code!: string;
}

@UseGuards(JwtAuthGuard)
@Controller('mfa')
export class MfaController {
  constructor(private readonly mfa: MfaService) {}

  @Post('setup')
  setup(@Req() req: any) {
    return this.mfa.setup(req.user.id);
  }

  @Post('enable')
  @HttpCode(200)
  enable(@Req() req: any, @Body() dto: MfaCodeDto) {
    return this.mfa.enable(req.user.id, dto.code);
  }

  @Post('verify')
  @HttpCode(200)
  async verify(@Req() req: any, @Body() dto: MfaCodeDto) {
    return { valid: await this.mfa.verifyForUser(req.user.id, dto.code) };
  }

  @Post('disable')
  @HttpCode(200)
  disable(@Req() req: any, @Body() dto: MfaCodeDto) {
    return this.mfa.disable(req.user.id, dto.code);
  }
}
