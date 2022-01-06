import { StructuresInterface } from 'src/Mongo/Interface/structures.interface';

export const InfluenzaStructure: StructuresInterface = {
  name: 'Influenza',
  type_parameters: {
    ambiente: {
      AMB: [],
      CONV: [],
      DISTRIBUICAOHUMANO: [],
    },
    humano: {
      INI: [],
      MOV: [],
      CONV: [],
      TRA: [],
    },
    simulacao: {
      SIM: [],
    },
  },
};
