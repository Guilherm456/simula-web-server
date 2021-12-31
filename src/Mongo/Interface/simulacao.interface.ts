import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Simulacao extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  city: [number];
  base: object;
}
