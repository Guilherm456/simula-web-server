import { Roles } from '@modules/users/entities/user.entity';
import { Request } from 'express';

export type MiddlewareRequest = Request & {
  user: {
    email: string;
    role: Roles;
    id: string;
  };
};
