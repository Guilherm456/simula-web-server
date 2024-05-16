import { ApiProperty } from '@nestjs/swagger';
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
  Length,
  ValidateNested,
} from 'class-validator';
import { AtLeastOneButNotBoth } from 'src/utils/customValidators';
import { AgentsStructureDTO } from './agents.dto';

class ValuesDTO {
  @IsString({ message: 'Nome do valor deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do valor é obrigatório' })
  @ApiProperty({
    description: 'Nome do valor',
    required: true,
  })
  name: string;

  @IsIn(['string', 'number', 'mixed'], { message: 'Tipo de valor inválido' })
  @IsNotEmpty({ message: 'Tipo de valor é obrigatório' })
  @ApiProperty({
    description: 'Tipo do valor',
    required: true,
    enum: ['string', 'number', 'mixed'],
  })
  type: 'string' | 'number' | 'mixed';
}

class ParametersDTO {
  @IsString({ message: 'Nome do parâmetro deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do parâmetro é obrigatório' })
  @ApiProperty({
    description: 'Nome do subparâmetro',
    required: true,
  })
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
  @ApiProperty({
    description: 'Valores do subparâmetro',
    required: true,
    minItems: 1,
  })
  values: ValuesDTO[];
}

class ParametersDTOFirst {
  @IsString({ message: 'Nome do parâmetro deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do parâmetro é obrigatório' })
  @ApiProperty({
    description: 'Nome do parâmetro',
    required: true,
  })
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
  @ApiProperty({
    description:
      'Valores do parâmetro (obrigatório se não houver subparâmetros)',
  })
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
  @ApiProperty({
    description:
      'Subparâmetros do parâmetro (obrigatório se não houver valores)',
  })
  subParameters: ParametersDTO[];
}

export class StructureDTO {
  @IsString({ message: 'Nome da estrutura é obrigatório' })
  @Length(4, 50, {
    message: 'Nome da estrutura deve ter entre 4 e 50 caracteres',
  })
  @ApiProperty({
    description: 'Nome da estrutura',
    required: true,
    minLength: 4,
    maxLength: 50,
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
  @ApiProperty({
    description: 'Parâmetros de entrada da estrutura',
    uniqueItems: true,
    required: true,
    minItems: 1,
  })
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
  @ApiProperty({
    description: 'Parâmetros de saída da estrutura',
    uniqueItems: true,
    required: true,
    minItems: 1,
  })
  outputParameters: ParametersDTOFirst[];

  @IsString({ message: 'Pasta de entrada é obrigatória' })
  @IsNotEmpty({ message: 'Pasta de entrada é obrigatória' })
  @ApiProperty({
    description: 'Pasta com os arquivos de entrada',
    required: true,
    example: '/inputs',
  })
  inputsFolder: string;

  @IsString({ message: 'Pasta de saída é obrigatória' })
  @IsNotEmpty({ message: 'Pasta de saída é obrigatória' })
  @ApiProperty({
    description: 'Pasta com todos os arquivos da estrutura',
    required: true,
    example: '/epidemic-simulator',
  })
  folder: string;

  @IsString({ message: 'Pasta de resultados é obrigatória' })
  @IsNotEmpty({ message: 'Pasta de resultados é obrigatória' })
  @ApiProperty({
    description: 'Pasta com os arquivos de resultados',
    required: true,
    example: '/results',
  })
  resultsFolder: string;

  @IsString({ message: 'Comando de execução é obrigatório' })
  @IsNotEmpty({ message: 'Comando de execução é obrigatório' })
  @ApiProperty({
    description: 'Comando para executar a estrutura',
    required: true,
    example: 'python3 main.py',
  })
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
  @ApiProperty({
    description: 'Agentes da estrutura',
    required: true,
    uniqueItems: true,
  })
  agents: AgentsStructureDTO[];
}
