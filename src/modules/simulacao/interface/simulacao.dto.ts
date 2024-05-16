import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SimulacaoDTO {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(4, 50, { message: 'Nome deve ter entre 4 e 50 caracteres' })
  @ApiProperty({
    description: 'Nome da simulação',
    required: true,
    maxLength: 50,
    minLength: 4,
  })
  name: string;
}
