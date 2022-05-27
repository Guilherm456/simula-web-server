import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Base } from './base.interface';

export interface Simulacao extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  city: [number, number];
  base: Base;
  progress: number;
  result: DatasProps[];
}

interface Data {
  index?: number;
  codName: string;
  state: number;
  coord: {
    lat: number;
    lng: number;
  };
}

export interface DatasProps extends Array<Data> {}

export interface SearchsProps {
  stateAgent?: {
    value: number;
  };
  propertiesAgent?: {
    properties: string;
    value: string | number;
  }[];
}
