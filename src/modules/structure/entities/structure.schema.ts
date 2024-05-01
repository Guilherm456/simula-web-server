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

const AgentSchema = new Schema({
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
});

export const StructureSchema = new Schema<Structure>({
  name: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  parameters: [ParametersSchema],
  outputParameters: [ParametersSchema],
  inputsFolder: {
    type: String,
    required: true,
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
    required: true,
    set: (value: string) => (value && value[0] === '/' ? value : '/' + value),
  },
  lengthParams: Number,
  executeCommand: String,
  agents: [AgentSchema],
});
