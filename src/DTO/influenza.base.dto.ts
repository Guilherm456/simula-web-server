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
  AMB: any[] | String;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  CON: any[] | String;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  DistribuicaoHumano: any[] | String;
}

class Humanos {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  INI: any[] | String;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  MOV: any[] | String;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  CON: any[] | String;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  TRA: any[] | String;
}

class Simulacao {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  @ValidateNested({ each: true })
  SIM: any[] | String;
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
