import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

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
