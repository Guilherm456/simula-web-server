import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SaidaDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  simulationId: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  data: object;
}
