import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { Types } from 'src/Mongo/Interface/types.inteface';
import { DengueStructureDTO } from './dengue.base.dto';
import { InfluenzaStructureDTO } from './influenza.base.dto';

export class BaseDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => DengueStructureDTO || InfluenzaStructureDTO)
  parameters: DengueStructureDTO | InfluenzaStructureDTO;

  @IsNotEmpty()
  @IsString()
  type: Types;
}
