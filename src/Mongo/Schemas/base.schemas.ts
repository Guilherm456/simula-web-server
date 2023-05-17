import { Schema } from 'mongoose';
import { DengueSchema } from './dengue.base.schema';

export const BaseSchema = new Schema({
  name: String,
  parameters: DengueSchema,
  type: String,
});
