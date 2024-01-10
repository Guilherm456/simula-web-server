import { Schema } from 'mongoose';
import { Base } from './base.interface';

export const BaseSchema = new Schema<Base>({
  name: String,

  parameters: {
    type: Object,
    of: {
      type: Schema.Types.ObjectId,
      ref: 'parameters',
    },
  },
  type: {
    ref: 'structures',
    type: Schema.Types.ObjectId,
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: String,

    default: new Date().toISOString(),
  },
  updatedAt: String,
});

BaseSchema.pre('findOneAndDelete', { document: true }, async function (next) {
  const doc = this as any;

  // await doc.model('simulacao').findOneAndDelete({ base: doc._id });

  const parameters = doc.parameters as any;
  for (const key in parameters) {
    console.debug('key', key);
    if (Object.prototype.hasOwnProperty.call(parameters, key)) {
      const parameter = parameters[key];
      await doc.model('parameters').deleteOne({ _id: parameter });
    }
  }
  // next();
});
