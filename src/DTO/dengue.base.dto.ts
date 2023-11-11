import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmptyObject,
} from 'class-validator';

export class DengueStructureDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-00-IndexQuadras': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-01-IndexVizinhancas': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-02-VetorVizinhancas': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-03-IndexPosicoes': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-04-VetorPosicoes': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-05-IndexPosicoesRegioes': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-06-IndexFronteiras': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-07-VetorFronteiras': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-08-IndexEsquinas': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-09-VetorEsquinas': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-10-IndexCentrosEsquinas': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '0-AMB-11-VetorCentrosEsquinas': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '1-MOV-00-IndexRotas': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '1-MOV-01-VetorRotas': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '1-MOV-02-IndexTrajetos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '1-MOV-03-IndexPeriodos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '1-MOV-04-VetorPeriodos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '1-MOV-05-IndexTrajetosFaixaEtaria': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-00-QuadrasVacinacao': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-01-FaixasEtariasVacinacao': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-02-CiclosVacinacao': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-03-QuadrasControleBio': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-04-QuadrasControleAmb': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-05-PontosEstrategicos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-06-IndexFocos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-07-VetorFocos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-08-ControlePorQuadra': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-09-VetorComplemento': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-10-VetorCasos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-11-InfoControles': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-12-IndexContrPontos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-13-ContrPontos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-14-IndexPontosRaios': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-15-PontosRaios': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '2-CON-16-HumanosVacinados': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  '3-CLI': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  'DistribuicaoHumanos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  'DistribuicaoMosquitos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  'focos': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  'lotes': any[] | string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNotEmptyObject({}, { each: true })
  'pes': any[] | string;
}
