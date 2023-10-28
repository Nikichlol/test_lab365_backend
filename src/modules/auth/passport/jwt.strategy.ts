import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EnvironmentVariables } from 'src/types/env';
import { ConfigService } from '@nestjs/config';
import { Payload } from 'src/types/auth';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY', { infer: true }),
    });
  }

  async validate(payload: Record<string, unknown>) {
    try {
      if (!this.isValidPayload(payload)) throw new Error();

      return await this.userService.findById(payload.userId);
    } catch (error) {
      throw new UnauthorizedException('Token is invalid');
    }
  }

  isValidPayload(payload: Record<string, unknown>): payload is Payload {
    return 'userId' in payload;
  }
}
