import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class BaseCreateDTO {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(3, 50, { message: 'Nome deve ter entre 3 e 50 caracteres' })
  @ApiProperty({
    description: 'Nome da base',
    required: true,
    maxLength: 50,
    minLength: 3,
    example: 'Base 1',
  })
  name: string;

  @IsString({ message: 'Descrição deve ser uma string' })
  @IsOptional()
  @MaxLength(255, { message: 'Descrição deve ter no máximo 255 caracteres' })
  @ApiProperty({
    required: false,
    description: 'Descrição da base',
  })
  description: string;
}
