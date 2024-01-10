import { IsEmail, IsString, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsString()
  token: string;
}

export class RecoverPasswordEmailDto {
  @IsString()
  @IsEmail()
  email: string;
}
