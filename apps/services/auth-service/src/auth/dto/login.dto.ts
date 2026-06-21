import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  // 6-digit TOTP, required only when the account has MFA enabled (G-017).
  @IsOptional()
  @IsString()
  mfa_code?: string;
}
