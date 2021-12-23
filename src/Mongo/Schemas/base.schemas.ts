import { Schema } from 'mongoose';
import { InfluenzaSchema } from './influenza.base.schema';

export const BaseSchema = new Schema({
  name: String,
  parameters: InfluenzaSchema,
});
