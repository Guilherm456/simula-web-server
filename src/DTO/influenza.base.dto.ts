import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/*
AMB
  AMB
  CONV
  DISTRIBUICAOHUMANO

HUMANO
  INI
  MOV
  CON
  TRA

SIMULACAO
  SIM
*/

class Ambiente {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  AMB: any[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  CON: any[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  DistribuicaoHumano: any[];
}

class Humanos {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  INI: any[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  MOV: any[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  CON: any[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  TRA: any[];
}

class Simulacao {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  SIM: any[];
}

export class InfluenzaStructureDTO {
  @IsNotEmptyObject()
  @Type(() => Ambiente)
  @ValidateNested({ each: true })
  ambiente: Ambiente;

  @IsNotEmptyObject()
  @Type(() => Humanos)
  @ValidateNested({ each: true })
  humanos: Humanos;

  @IsNotEmptyObject()
  @Type(() => Simulacao)
  @ValidateNested({ each: true })
  simulacao: Simulacao;
}
