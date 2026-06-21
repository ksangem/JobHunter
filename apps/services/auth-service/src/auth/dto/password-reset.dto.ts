import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class PasswordResetRequestDto {
  @IsEmail()
  email!: string;
}

export class PasswordResetDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6)
  otp!: string;

  @IsString()
  @MinLength(12)
  new_password!: string;
}
