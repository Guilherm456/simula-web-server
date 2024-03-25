import { Schema } from 'mongoose';
import { Output } from './interface/output.interface';

export const OutputSchema = new Schema<Output>({
  simulation: {
    type: Schema.Types.ObjectId,
    ref: 'simulacao',
  },
  data: {
    type: Object,
    of: {
      type: Schema.Types.ObjectId,
      ref: 'parameters',
    },
  },
  structure: {
    type: Schema.Types.ObjectId,
    ref: 'structures',
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  agentsStats: [
    {
      agent: {
        type: Schema.Types.ObjectId,
      },
      stats: [Number],
    },
  ],
});
