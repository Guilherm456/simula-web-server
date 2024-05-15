import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AtLeastOneButNotBoth } from 'src/utils/customValidators';
import { AgentsStructureDTO } from './agents.dto';

class ValuesDTO {
  @IsString({ message: 'Nome do valor deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do valor é obrigatório' })
  name: string;

  @IsIn(['string', 'number', 'mixed'], { message: 'Tipo de valor inválido' })
  @IsNotEmpty({ message: 'Tipo de valor é obrigatório' })
  type: 'string' | 'number' | 'mixed';
}

class ParametersDTO {
  @IsString({ message: 'Nome do parâmetro deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do parâmetro é obrigatório' })
  name: string;

  @IsArray({ message: 'Valores do parâmetro devem ser um array' })
  @ArrayMinSize(1, {
    message: 'Valores do parâmetro devem ter no mínimo 1 item',
  })
  @ValidateNested({ each: true })
  @ArrayUnique((value: ValuesDTO) => value.name, {
    message: 'Nome do valor deve ser único',
  })
  @Type(() => ValuesDTO)
  values: ValuesDTO[];
}

class ParametersDTOFirst {
  @IsString({ message: 'Nome do parâmetro deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do parâmetro é obrigatório' })
  name: string;

  @IsArray({ message: 'Valores do parâmetro devem ser um array' })
  @IsOptional()
  @ArrayMinSize(1, {
    message: 'Valores do parâmetro devem ter no mínimo 1 item',
  })
  @ValidateNested({ each: true })
  @ArrayUnique((value: ValuesDTO) => value.name, {
    message: 'Nome do valor deve ser único',
  })
  @Type(() => ValuesDTO)
  values: ValuesDTO[];

  @IsArray({ message: 'Subparâmetros do parâmetro devem ser um array' })
  @IsOptional()
  @ArrayMinSize(1, {
    message: 'Subparâmetros do parâmetro devem ter no mínimo 1 item',
  })
  @ValidateNested({ each: true })
  @ArrayUnique((parameter: ParametersDTO) => parameter.name, {
    message: 'Nome do parâmetro deve ser único',
  })
  @Type(() => ParametersDTO)
  subParameters: ParametersDTO[];
}

export class StructureDTO {
  @IsString({ message: 'Nome da estrutura é obrigatório' })
  @MinLength(4, {
    message: 'Nome da estrutura deve ter no mínimo 4 caracteres',
  })
  name: string;

  @IsArray({ message: 'Parâmetros da estrutura devem ser um array' })
  @ArrayMinSize(1, {
    message: 'Parâmetros da estrutura devem ter no mínimo 1 item',
  })
  @ValidateNested({ each: true })
  @ArrayUnique((parameter: ParametersDTO) => parameter.name, {
    message: 'Nome do parâmetro deve ser único',
  })
  @Type(() => ParametersDTOFirst)
  @AtLeastOneButNotBoth(['values', 'subParameters'])
  parameters: ParametersDTOFirst[];

  @IsArray({ message: 'Parâmetros de saída da estrutura devem ser um array' })
  @ArrayMinSize(1, {
    message: 'Parâmetros de saída da estrutura devem ter no mínimo 1 item',
  })
  @ValidateNested({ each: true })
  @ArrayUnique((parameter: ParametersDTO) => parameter.name, {
    message: 'Nome do parâmetro de saída deve ser único',
  })
  @Type(() => ParametersDTOFirst)
  @AtLeastOneButNotBoth(['values', 'subParameters'])
  outputParameters: ParametersDTOFirst[];

  @IsString({ message: 'Pasta de entrada é obrigatória' })
  @IsNotEmpty({ message: 'Pasta de entrada é obrigatória' })
  inputsFolder: string;

  @IsString({ message: 'Pasta de saída é obrigatória' })
  @IsNotEmpty({ message: 'Pasta de saída é obrigatória' })
  folder: string;

  @IsString({ message: 'Pasta de resultados é obrigatória' })
  @IsNotEmpty({ message: 'Pasta de resultados é obrigatória' })
  resultsFolder: string;

  @IsString({ message: 'Comando de execução é obrigatório' })
  @IsNotEmpty({ message: 'Comando de execução é obrigatório' })
  executeCommand: string;

  @IsArray({ message: 'Agentes da estrutura devem ser um array' })
  @IsNotEmpty({ message: 'Agentes da estrutura são obrigatórios' })
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @ArrayUnique((agent: AgentsStructureDTO) => agent.label, {
    message: 'Rótulo de cada agente deve ser único',
  })
  @ArrayUnique((agent: AgentsStructureDTO) => agent.color, {
    message: 'Cor de cada agente deve ser única',
  })
  @Type(() => AgentsStructureDTO)
  agents: AgentsStructureDTO[];
}
