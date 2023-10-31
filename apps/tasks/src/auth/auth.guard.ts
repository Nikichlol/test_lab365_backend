import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { User } from 'apps/auth/src/modules/user/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH') private readonly authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = await lastValueFrom<User | false>(
      this.authClient.send({ cmd: 'validate_user' }, request.headers),
    );

    if (!user) throw new UnauthorizedException();

    request.currentUser = user;

    return true;
  }
}
