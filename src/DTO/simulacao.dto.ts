import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Base } from 'src/Mongo/Interface/base.interface';

export class SimulacaoDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsNotEmpty()
  city: number[];
}
