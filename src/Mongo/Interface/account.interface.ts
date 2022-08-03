import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Account extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  password: string;
  email: string;
  acess: [string];
}
