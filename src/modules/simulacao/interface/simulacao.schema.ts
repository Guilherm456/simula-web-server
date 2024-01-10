import { Schema } from 'mongoose';
import { Simulacao } from './simulacao.interface';

export const SimulacaoSchema = new Schema<Simulacao>({
  name: String,
  base: {
    ref: 'base',
    type: Schema.Types.ObjectId,
  },
  structure: {
    ref: 'structures',
    type: Schema.Types.ObjectId,
  },
  status: {
    type: String,
    enum: ['PENDING', 'RUNNING', 'FINISHED', 'ERROR'],
    default: 'PENDING',
  } as any,
  parameters: {
    type: Object,
    of: {
      type: Schema.Types.ObjectId,
      ref: 'parameters',
    },
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: String,

    default: new Date().toISOString(),
  },
  updatedAt: String,
});
