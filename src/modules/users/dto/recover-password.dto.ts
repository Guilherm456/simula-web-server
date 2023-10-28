import { IsString, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @IsString()
  @MinLength(8)
  newPassword: string;
}
