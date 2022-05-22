import { StructuresInterface } from 'src/Mongo/Interface/structures.interface';

export const InfluenzaStructure: StructuresInterface = {
  name: 'Influenza',
  states: [
    {
      name: 'Infectante',
      color: '#ff0000',
    },
    {
      name: 'Suscetível',
      color: '#ffa500',
    },
    {
      name: 'Exposto',
      color: '#ffffdf',
    },
    {
      name: 'Recuperado',
      color: '#00ff00',
    },
  ],
  type_parameters: {
    Ambiente: {
      AMB: [],
      CON: [],
      DistribuicaoHumanos: [],
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
  defaultSearch: ['Ambiente', 'DistribuicaoHumano'],
};
