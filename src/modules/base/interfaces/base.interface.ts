import { Structure } from '@modules/structure/entities/structures.interface';
import { User } from '@modules/users/entities/user.entity';
import { Document } from 'mongoose';

export interface Base {
  name: string;
  type: Structure | string;
  user: User | string;
  createdAt: string;
  updatedAt?: string;
  parameters: object;
}

export type BaseDocument = Base & Document;
