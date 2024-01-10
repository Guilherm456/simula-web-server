import { Schema } from 'mongoose';

export const SaidaSchema = new Schema({
  simulationId: {
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
    ref: 'structure',
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  agentsStats: [
    {
      agent: Object,
      stats: [Number],
    },
  ],
});
