import { Document } from 'mongoose';

export interface User {
  name: string;
  email: string;
  password: string;
  role: Roles;
  createdAt: string;
  updatedAt?: string;
  _id?: string;
}

export type Roles = 'admin' | 'user' | 'guest';

export type UserDocument = User & Document;
