import { Schema } from 'mongoose';
import { BaseSchema } from './base.schemas';

export const SimulacaoSchema = new Schema({
  name: String,
  city: [Number],
  base: BaseSchema,
  progress: Number,
});
