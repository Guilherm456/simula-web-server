import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class SimulacaoDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsNotEmpty()
  city: number[];
}
