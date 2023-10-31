import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../../types/auth';

@Injectable()
export class JwtService2 {
  constructor(private jwtService: JwtService) {}

  encrypt(userId: string): Promise<string> {
    const payload: Payload = { userId };
    return this.jwtService.signAsync(payload);
  }

  decrypt(token: string): Promise<Payload> {
    return this.jwtService.verifyAsync<Payload>(token);
  }
}
