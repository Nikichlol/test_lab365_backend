import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_SKIP_AUTH_KEY } from './skip-auth.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isSkipAuth = this.reflector.getAllAndOverride<boolean>(
      IS_SKIP_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isSkipAuth) return true;

    const request = context.switchToHttp().getRequest<Request>();

    try {
      const user = await this.authService.validateUserToken(request.headers);

      request.currentUser = user;

      return true;
    } catch (error) {
      Logger.error('JwtAuthGuard error', error);

      throw new UnauthorizedException();
    }
  }
}
