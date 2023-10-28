import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const publicRoute = this.reflector.get<boolean>(
      'public',
      context.getHandler(),
    );

    if (publicRoute) return true;

    const roles = this.reflector.get<string>('roles', context.getHandler());

    const request = context.switchToHttp().getRequest();

    try {
      const token = request.headers.authorization.split(' ')[1];
      const user = this.jwtService.decode(token) as { [key: string]: any };

      if (!user || !user?.role) return false;

      if (!roles) return true;

      const roleHierarchy = {
        guest: ['guest', 'user', 'admin'],
        user: ['user', 'admin'],
        admin: ['admin'],
      };

      return roleHierarchy[roles]?.find((elem: string) => elem === user.role);
    } catch (err) {
      return false;
    }
  }
}
