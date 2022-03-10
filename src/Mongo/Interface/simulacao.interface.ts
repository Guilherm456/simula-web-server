import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Base } from './base.interface';

export interface Simulacao extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  city: [number];
  base: Base;
  progress: number;
}
