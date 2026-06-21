import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@jobhunter/types';

export class RegisterDto {
  @IsEmail()
  email!: string;

  // Full policy (min12/upper/lower/digit/symbol) enforced in AuthService.
  @IsString()
  @MinLength(12)
  password!: string;

  @IsString()
  @MinLength(2)
  full_name!: string;

  // Defaults to CANDIDATE in the service if omitted.
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
