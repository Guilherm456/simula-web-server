import { StructuresInterface } from 'src/Mongo/Interface/structures.interface';

export const InfluenzaStructure: StructuresInterface = {
  name: 'Influenza',
  type_parameters: {
    ambiente: {
      AMB: [],
      CON: [],
      DISTRIBUICAOHUMANO: [],
    },
    humano: {
      INI: [],
      MOV: [],
      CON: [],
      TRA: [],
    },
    simulacao: {
      SIM: [],
    },
  },
};
