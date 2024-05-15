import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail(undefined, { message: 'Email inválido' })
  email: string;

  @IsString({ message: 'Senha é obrigatória' })
  password: string;
}
