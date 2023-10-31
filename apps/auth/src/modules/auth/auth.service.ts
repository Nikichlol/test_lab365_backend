import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { UserService } from '../user/user.service';
import { JwtService2 } from '../jwt/jwt.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.schema';
import { Payload } from '../../types/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService2,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const userId = (await this.userService.create(createUserDto)).id as string;

    const token = await this.jwtService.encrypt(userId);

    return {
      id: userId,
      token,
    };
  }

  async signin({ id }: User) {
    const token = await this.jwtService.encrypt(id as string);

    return {
      token,
    };
  }

  async validateUserToken(headers: IncomingHttpHeaders): Promise<User> {
    const token = this.extractTokenFromHeader(headers);

    if (!token) throw new UnauthorizedException();

    const payload = await this.jwtService.decrypt(token);

    if (!this.isPayloadValid(payload)) throw new UnauthorizedException();

    return this.userService.findById(payload.userId);
  }

  private isPayloadValid(payload: Record<string, unknown>): payload is Payload {
    return 'userId' in payload;
  }

  private extractTokenFromHeader(
    headers: IncomingHttpHeaders,
  ): string | undefined {
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
