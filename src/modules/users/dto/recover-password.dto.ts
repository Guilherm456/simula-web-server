import { IsEmail, IsString, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @IsString({ message: 'Nova senha é obrigatória' })
  @MinLength(8, { message: 'Nova senha deve ter no mínimo 8 caracteres' })
  newPassword: string;

  @IsString({ message: 'Token é obrigatório' })
  token: string;
}

export class RecoverPasswordEmailDto {
  @IsString({ message: 'Email é obrigatório' })
  @IsEmail(undefined, { message: 'Email inválido' })
  email: string;
}
