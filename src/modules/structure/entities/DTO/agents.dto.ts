import { IsString, Length, MinLength } from 'class-validator';

export class AgentsStructureDTO {
  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsString()
  @Length(7, 7)
  color: string;

  @IsString()
  @MinLength(5)
  onData: string;
}
