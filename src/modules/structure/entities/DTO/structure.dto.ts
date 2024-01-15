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
import { AtLeastOneButNotBoth } from 'src/DTO/customValidators';
import { AgentsStructureDTO } from './agents.dto';

class ValuesDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['string', 'number', 'mixed'])
  @IsNotEmpty()
  type: 'string' | 'number' | 'mixed';
}

class ParametersDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @ArrayUnique((value: ValuesDTO) => value.name, {
    message: 'Name must be unique',
  })
  @Type(() => ValuesDTO)
  values: ValuesDTO[];
}

class ParametersDTOFirst {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @ArrayUnique((value: ValuesDTO) => value.name, {
    message: 'Name must be unique',
  })
  @Type(() => ValuesDTO)
  values: ValuesDTO[];

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @ArrayUnique((parameter: ParametersDTO) => parameter.name, {
    message: 'Name must be unique',
  })
  @Type(() => ParametersDTO)
  subParameters: ParametersDTO[];
}

export class StructureDTO {
  @IsString()
  @MinLength(4)
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @ArrayUnique((parameter: ParametersDTO) => parameter.name, {
    message: 'Name must be unique',
  })
  @Type(() => ParametersDTOFirst)
  @AtLeastOneButNotBoth(['values', 'subParameters'])
  parameters: ParametersDTOFirst[];

  @IsString()
  @IsOptional()
  inputsFolder: string;

  @IsString()
  @IsNotEmpty()
  folder: string;

  @IsString()
  @IsOptional()
  resultsFolder: string;

  @IsString()
  @IsNotEmpty()
  executeCommand: string;

  @IsArray()
  @IsNotEmpty()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @ArrayUnique((agent: AgentsStructureDTO) => agent.label, {
    message: 'Label must be unique',
  })
  @ArrayUnique((agent: AgentsStructureDTO) => agent.color, {
    message: 'Color must be unique',
  })
  @Type(() => AgentsStructureDTO)
  agents: AgentsStructureDTO[];
}
