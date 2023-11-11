import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface Saida extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  simulationId: mongoose.Schema.Types.ObjectId;
  data: object;
}
