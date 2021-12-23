import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDefined,
  isNotEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { InfluenzaStructureDTO } from './influenza.base.dto';

export class BaseDTO {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  name: string;

  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => InfluenzaStructureDTO)
  parameters: InfluenzaStructureDTO;
}
