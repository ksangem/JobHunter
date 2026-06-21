// ============================================================================
// AuthController — FR-JS-001..007. All routes under /api/v1/auth.
// Public routes are marked @Public(); logout requires a valid access token.
// ============================================================================
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RefreshDto } from './dto/refresh.dto';
import { PasswordResetDto, PasswordResetRequestDto } from './dto/password-reset.dto';

function clientIp(req: any): string {
  return (req.headers['x-forwarded-for']?.split(',')[0] ?? req.ip ?? 'unknown').trim();
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto, @Req() req: any) {
    return this.auth.register(dto, clientIp(req));
  }

  @Public()
  @Post('verify-email')
  @HttpCode(200)
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto.email, dto.otp);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto, @Req() req: any) {
    return this.auth.login(dto, { ip: clientIp(req), userAgent: req.headers['user-agent'] });
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() dto: RefreshDto, @Req() req: any) {
    return this.auth.refresh(dto.refresh_token, {
      ip: clientIp(req),
      userAgent: req.headers['user-agent'],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Req() req: any) {
    return this.auth.logout(req.user.jti);
  }

  @Public()
  @Post('password/reset-request')
  @HttpCode(200)
  resetRequest(@Body() dto: PasswordResetRequestDto) {
    return this.auth.requestPasswordReset(dto.email);
  }

  @Public()
  @Post('password/reset')
  @HttpCode(200)
  reset(@Body() dto: PasswordResetDto) {
    return this.auth.resetPassword(dto.email, dto.otp, dto.new_password);
  }

  // --- Google OAuth (FR-JS-002) ---
  @Public()
  @Get('oauth/google')
  @UseGuards(AuthGuard('google'))
  googleStart() {
    // Passport redirects to Google's consent screen.
  }

  @Public()
  @Get('oauth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const tokens = await this.auth.findOrCreateOAuthUser(req.user, {
      ip: clientIp(req),
      userAgent: req.headers['user-agent'],
    });
    // Hand tokens back to the app via deep link (mobile) / fragment (web).
    const redirect = process.env.OAUTH_SUCCESS_REDIRECT ?? 'jobhunter://auth/callback';
    res.redirect(
      `${redirect}#access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`,
    );
  }
}
