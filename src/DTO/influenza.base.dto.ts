import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';

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
  AMB: any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  CON: any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  DistribuicaoHumano: any[] | string;
}

class Humanos {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  INI: any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  MOV: any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  CON: any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  TRA: any[] | string;
}

class Simulacao {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  SIM: any[] | string;
}

export class InfluenzaStructureDTO {
  @IsNotEmptyObject()
  @Type(() => Ambiente)
  @ValidateNested({ each: true })
  Ambiente: Ambiente;

  @IsNotEmptyObject()
  @Type(() => Humanos)
  @ValidateNested({ each: true })
  Humanos: Humanos;

  @IsNotEmptyObject()
  @Type(() => Simulacao)
  @ValidateNested({ each: true })
  Simulacao: Simulacao;
}

export class Teste123DTO {
  @IsNotEmptyObject()
  a: [];
}
