import { IsEmail, IsIn, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsIn(['admin', 'user', 'guest'])
  role: string;
}
