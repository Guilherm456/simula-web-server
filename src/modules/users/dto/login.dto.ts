import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail(undefined, { message: 'Email inválido' })
  @ApiProperty({
    description: 'Email do usuário',
    required: true,
  })
  email: string;

  @IsString({ message: 'Senha é obrigatória' })
  @ApiProperty({
    description: 'Senha do usuário',
    required: true,
  })
  password: string;
}
