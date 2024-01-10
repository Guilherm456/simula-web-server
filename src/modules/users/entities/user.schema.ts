import { Schema } from 'mongoose';
import { User } from './user.entity';

export const UserSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guest'],
    default: 'user',
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
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
