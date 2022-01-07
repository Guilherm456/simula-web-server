import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Base extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  parameters: object;
  type: 'influenza';
}
