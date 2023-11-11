import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Types } from './types.inteface';

export interface Base extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  parameters: string;
  parametersID: mongoose.Schema.Types.ObjectId;
  type: Types;
}
