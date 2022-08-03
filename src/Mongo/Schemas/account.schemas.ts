import { Schema } from 'mongoose';

export const AccountSchema = new Schema({
  name: String,
  password: String,
  email: String,
  acess: [String],
});

export type AccesTypes = 'admin' | 'user';
