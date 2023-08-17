import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { DengueStructureDTO } from './dengue.base.dto';
import { InfluenzaStructureDTO } from './influenza.base.dto';

export class SimulacaoDTO {
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  name: string;

  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsNotEmpty()
  city: number[];
}

export class SimulacaoDTOEdit extends SimulacaoDTO {
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  @Type(() => DengueStructureDTO || InfluenzaStructureDTO)
  parameters: DengueStructureDTO | InfluenzaStructureDTO;
}
