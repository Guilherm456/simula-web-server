import { Schema } from 'mongoose';

export const InfluenzaSchema = new Schema({
  ambiente: {
    AMB: [],
    CON: [],
    DistribuicaoHumano: [],
  },
  humanos: {
    INI: [],
    MOV: [],
    CON: [],
    TRA: [],
  },
  simulacao: {
    SIM: [],
  },
});
