import { Roles as RolesType } from '@modules/users/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: RolesType[]) => SetMetadata('roles', roles);

export const Public = () => SetMetadata('public', true);
