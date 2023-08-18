import { Schema } from 'mongoose';

export const SaidaSchema = new Schema({
  simulationId: Schema.Types.ObjectId,
  data: Object
});
