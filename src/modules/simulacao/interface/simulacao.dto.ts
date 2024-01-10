import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { DengueStructureDTO } from '../../../DTO/dengue.base.dto';
import { InfluenzaStructureDTO } from '../../../DTO/influenza.base.dto';

export class SimulacaoDTO {
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  name: string;
}

export class SimulacaoEditDTO extends SimulacaoDTO {
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => DengueStructureDTO || InfluenzaStructureDTO)
  parameters: DengueStructureDTO | InfluenzaStructureDTO;
}
