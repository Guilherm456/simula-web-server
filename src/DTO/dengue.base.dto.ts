import {
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsNotEmptyObject,
    ValidateNested,
  } from 'class-validator';
  
  export class DengueStructureDTO {
  

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-00-IndexQuadras': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-01-IndexVizinhancas': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-02-VetorVizinhancas': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-03-IndexPosicoes': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-04-VetorPosicoes': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-05-IndexPosicoesRegioes': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-06-IndexFronteiras': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-07-VetorFronteiras': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-08-IndexEsquinas': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-09-VetorEsquinas': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-10-IndexCentrosEsquinas': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '0-AMB-11-VetorCentrosEsquinas': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '1-MOV-00-IndexRotas': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '1-MOV-01-VetorRotas': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '1-MOV-02-IndexTrajetos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '1-MOV-03-IndexPeriodos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '1-MOV-04-VetorPeriodos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '1-MOV-05-IndexTrajetosFaixaEtaria': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-00-QuadrasVacinacao': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-01-FaixasEtariasVacinacao': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-02-CiclosVacinacao': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-03-QuadrasControleBio': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-04-QuadrasControleAmb': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-05-PontosEstrategicos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-06-IndexFocos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-07-VetorFocos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-08-ControlePorQuadra': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-09-VetorComplemento': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-10-VetorCasos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-11-InfoControles': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-12-IndexContrPontos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-13-ContrPontos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-14-IndexPontosRaios': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-15-PontosRaios': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '2-CON-16-HumanosVacinados': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '3-CLI': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    'DistribuicaoHumanos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    'DistribuicaoMosquitos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    'focos': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    'lotes': any[] | String;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    'pes': any[] | String;
}