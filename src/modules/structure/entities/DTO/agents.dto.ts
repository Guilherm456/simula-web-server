import { IsHexColor, IsString, Length, MinLength } from 'class-validator';

export class AgentsStructureDTO {
  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  @IsString({ message: 'Um rótulo é obrigatório' })
  label: string;

  @IsHexColor({ message: 'Cor inválida' })
  @Length(7, 7, { message: 'Cor deve ter 7 caracteres' })
  color: string;

  @IsString({ message: 'Um comando é obrigatório' })
  @MinLength(5, { message: 'Comando deve ter no mínimo 5 caracteres' })
  onData: string;
}
