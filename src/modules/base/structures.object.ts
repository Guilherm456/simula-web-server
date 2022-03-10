import { StructuresInterface } from 'src/Mongo/Interface/structures.interface';

export const InfluenzaStructure: StructuresInterface = {
  name: 'Influenza',
  type_parameters: {
    Ambiente: {
      AMB: [],
      CON: [],
      DISTRIBUICAOHUMANO: [],
    },
    Humano: {
      INI: [],
      MOV: [],
      CON: [],
      TRA: [],
    },
    Simulacao: {
      SIM: [],
    },
  },
};
