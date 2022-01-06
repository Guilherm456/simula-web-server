import { Schema } from 'mongoose';

export const InfluenzaSchema = new Schema({
  ambiente: {
    AMB: [],
    CONV: [],
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
