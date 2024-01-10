import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { DengueStructureDTO } from 'src/DTO/dengue.base.dto';
import { InfluenzaStructureDTO, Teste123DTO } from 'src/DTO/influenza.base.dto';

export class BaseDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  // @Type(() => DengueStructureDTO || InfluenzaStructureDTO || Teste123DTO)
  parameters: DengueStructureDTO | InfluenzaStructureDTO | Teste123DTO;
}
