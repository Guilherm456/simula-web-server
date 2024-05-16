import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome é obrigatório' })
  @ApiProperty({
    description: 'Nome do usuário',
    required: true,
  })
  name: string;

  @IsEmail(undefined, { message: 'Email deve ser válido' })
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

  @IsString({ message: 'Um papel é obrigatório' })
  @IsIn(['admin', 'user', 'guest'], { message: 'Papel inválido' })
  @ApiProperty({
    description: 'Papel do usuário',
    required: true,
    enum: ['admin', 'user', 'guest'],
  })
  role: string;
}
