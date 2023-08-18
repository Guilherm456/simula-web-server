import { Schema } from 'mongoose';
import { BaseSchema } from './base.schemas';
import { DataResultSchema } from './dataResult.schema';

export const SimulacaoSchema = new Schema({
  name: String,
  city: [Number],
  base: BaseSchema,
  // baseID: String,
  // type: String,
  // parametersID: String,
  status: String,
  result: [[DataResultSchema]],
});
