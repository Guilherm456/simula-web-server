import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Base } from './base.interface';

export enum StatusEnum {
  'PENDING' = 'PENDING',
  'RUNNING' = 'RUNNING',
  'FINISHED' = 'FINISHED',
  'ERROR' = 'ERROR',
}

export interface Simulacao extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  city: [number, number];
  base: Base;
  status: StatusEnum;
  result: DatasProps[];
}

interface Data {
  index?: number;
  codName: string;
  state: number;
  isArea?: boolean;
  coord:
    | {
        lat: number;
        lng: number;
      }
    | {
        latStart: number;
        lngStart: number;
        latEnd: number;
        lngEnd: number;
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
