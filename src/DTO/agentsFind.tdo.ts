import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class AgentFind {
  @IsNotEmpty()
  value: string | number;

  @IsNotEmpty()
  @IsString()
  properties: string;
}

class StateFind {
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
export class FindDTO {
  @IsOptional()
  @Type(() => StateFind)
  @ValidateNested()
  stateAgent?: StateFind;

  @Type(() => AgentFind)
  @ValidateNested({ each: true })
  propertiesAgent: AgentFind[];
}
