import { Base } from '@modules/base/interfaces/base.interface';
import { Output } from '@modules/saida/interface/output.interface';
import { Structure } from '@modules/structure/entities/structures.interface';
import { User } from '@modules/users/entities/user.entity';
import { Document } from 'mongoose';

export enum StatusEnum {
  'PENDING' = 'PENDING',
  'RUNNING' = 'RUNNING',
  'FINISHED' = 'FINISHED',
  'ERROR' = 'ERROR',
}

export interface Simulacao {
  active: boolean;
  name: string;
  base: Base | string;
  status: StatusEnum;
  structure: Structure | string;
  output?: Output | string;
  user: User | string;
  parameters: object;
  createdAt: string;
  updatedAt?: string;
  _id?: string;
}

export type SimulacaoDocument = Simulacao & Document;
