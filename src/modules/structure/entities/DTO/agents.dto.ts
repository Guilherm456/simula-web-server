import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsString, Length, MinLength } from 'class-validator';

export class AgentsStructureDTO {
  @IsString({ message: 'Nome do agente é obrigatório' })
  @ApiProperty({
    description: 'Nome do agente',
    required: true,
  })
  name: string;

  @IsString({ message: 'Um rótulo para o agente é obrigatório' })
  @ApiProperty({
    description: 'Rótulo do agente',
    required: true,
  })
  label: string;

  @IsHexColor({ message: 'Cor inválida para o agente' })
  @Length(7, 7, { message: 'Cor deve ter 7 caracteres' })
  @ApiProperty({
    description: 'Cor do agente',
    required: false,
  })
  color: string;

  @IsString({
    message: 'Um comando para extrair dados de agente é obrigatório',
  })
  @MinLength(5, { message: 'Comando deve ter no mínimo 5 caracteres' })
  @ApiProperty({
    description:
      'É o comando que será executado para extrair dados do agente após a execução de uma simulação, deve ser uma função que recebe dois parâmetros: data e type. Deve retornar um array de números, onde cada número representa a quantidade de agentes vivos no ciclo correspondente.',
    required: true,
    default: 'function (data, type) { return data[type.label]; }',
  })
  onData: string;
}
