import { Schema } from 'mongoose';
import { BaseSchema } from './base.schemas';
import { DataResultSchema } from './dataResult.schema';

enum Status {
  'PENDING',
  'RUNNING',
  'FINISHED',
  'ERROR',
}

export const SimulacaoSchema = new Schema({
  name: String,
  city: [Number],
  base: BaseSchema,
  progress: Number,
  status: Status,
  result: [[DataResultSchema]],
});
