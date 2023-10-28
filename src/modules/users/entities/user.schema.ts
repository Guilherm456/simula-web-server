import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: String,
  updatedAt: String,
});

UserSchema.pre('deleteOne', { document: true }, async function (next) {
  const user = this as any;
  await user.model('simulacao').deleteMany({
    user: {
      _id: user._id,
    },
  });
  await user.model('base').deleteMany({
    user: {
      _id: user._id,
    },
  });
  next();
});
