import { Model } from 'mongoose';

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

export interface UserDocument extends User, Document {}

export type UserModel = Model<UserDocument>;
