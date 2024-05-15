import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SimulacaoDTO {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(4, 50, { message: 'Nome deve ter entre 4 e 50 caracteres' })
  name: string;
}
