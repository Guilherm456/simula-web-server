import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @IsString({ message: 'Nova senha é obrigatória' })
  @MinLength(8, { message: 'Nova senha deve ter no mínimo 8 caracteres' })
  @ApiProperty({
    description: 'Nova senha do usuário',
    required: true,
    minLength: 8,
  })
  newPassword: string;

  @IsString({ message: 'Token é obrigatório' })
  @ApiProperty({
    description: 'Token de recuperação de senha',
    required: true,
  })
  token: string;
}

export class RecoverPasswordEmailDto {
  @IsString({ message: 'Email é obrigatório' })
  @IsEmail(undefined, { message: 'Email inválido' })
  @ApiProperty({
    description: 'Email do usuário',
    required: true,
  })
  email: string;
}
