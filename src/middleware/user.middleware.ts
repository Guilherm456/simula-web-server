import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';
import { MiddlewareRequest } from 'src/interfaces/middleware.interface';

@Injectable()
export class JwtDecodeMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: MiddlewareRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
    if (token) {
      try {
        const user = this.jwtService.decode(token);

        req.user = user;
      } catch (error) {}
    }
    next();
  }
}
