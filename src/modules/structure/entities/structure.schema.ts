import { Schema } from 'mongoose';
import {
  Structure,
  StructureParameters,
  StructureValues,
} from './structures.interface';

const ParametersValueSchema = new Schema<StructureValues>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['string', 'number', 'mixed'],
  },
});

const ParametersSchema = new Schema<StructureParameters>({
  name: {
    type: String,
    required: true,
  },
  values: [ParametersValueSchema],
  subParameters: [
    {
      name: {
        type: String,
        required: true,
      },
      values: [ParametersValueSchema],
    },
  ],
});

export const StructureSchema = new Schema<Structure>({
  name: {
    type: String,
    required: true,
  },
  parameters: [ParametersSchema],
  inputsFolder: {
    type: String,
    set: (value: string) => (value && value[0] === '/' ? value : '/' + value),
  },
  folder: {
    type: String,
    required: true,
    unique: true,
    set: (value: string) => (value[0] === '/' ? value : '/' + value),
  },
  resultsFolder: {
    type: String,
    set: (value: string) => (value && value[0] === '/' ? value : '/' + value),
  },
  lengthParams: Number,
  executeCommand: String,
  agents: [
    {
      name: String,
      label: {
        type: String,
      },
      color: {
        type: String,
        default: '#000000',
      },
      onData: {
        type: String,
        get: (value: string) => eval(value),
        default: 'function (data, type) { return data[type.label]}',
      },
    },
  ],
});

// StructureSchema.pre('findOneAndDelete', async function (next, ops) {
//   console.debug(this, next, ops);
//   // const structure = await this.model.findOne(this.getQuery());
//   // if (!structure) return next();

//   // const { folder } = structure;
//   // const { exec } = require('child_process');
//   // exec(`rm -rf ${folder}`, (err, stdout, stderr) => {
//   //   if (err) {
//   //     console.error(err);
//   //     return;
//   //   }
//   //   console.log(stdout);
//   // });

//   // next();
// });
