import { Schema } from 'mongoose';

export const InfluenzaSchema = new Schema({
  Ambiente: {
    AMB: [],
    CON: [],
    DistribuicaoHumano: [],
  },
  Humanos: {
    INI: [],
    MOV: [],
    CON: [],
    TRA: [],
  },
  Simulacao: {
    SIM: [],
  },
});
