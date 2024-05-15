import { IsEmail, IsIn, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail(undefined, { message: 'Email deve ser válido' })
  email: string;

  @IsString({ message: 'Senha é obrigatória' })
  password: string;

  @IsString({ message: 'Um papel é obrigatório' })
  @IsIn(['admin', 'user', 'guest'], { message: 'Papel inválido' })
  role: string;
}
