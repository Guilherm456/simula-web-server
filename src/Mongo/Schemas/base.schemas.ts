import { Schema } from 'mongoose';

export const BaseSchema = new Schema({
  name: String,
  parametersID: String,
  type: String,
});
