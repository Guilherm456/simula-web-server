import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class BaseDTO {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(3, 50, { message: 'Nome deve ter entre 3 e 50 caracteres' })
  name: string;

  @IsString({ message: 'Descrição deve ser uma string' })
  @IsOptional()
  @MaxLength(255, { message: 'Descrição deve ter no máximo 255 caracteres' })
  description: string;
}
