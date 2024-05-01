import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const publicRoute = this.reflector.get<boolean>(
      'public',
      context.getHandler(),
    );
    if (publicRoute) return true;

    const roles = this.reflector.get<string>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user || !user.role) return false;
    if (!roles) return true;

    const roleHierarchy = {
      guest: ['guest', 'user', 'admin'],
      user: ['user', 'admin'],
      admin: ['admin'],
    };

    return roleHierarchy[roles]?.includes(user.role);
  }
}
