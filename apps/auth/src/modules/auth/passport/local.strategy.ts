import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { SecretService } from '../../secret/secret.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private readonly secretService: SecretService,
  ) {
    super({
      usernameField: 'id',
    });
  }

  async validate(id: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findById(id);
      const userPassword = this.secretService.decrypt(user.password);

      if (!user || userPassword !== password) throw new Error();

      return user;
    } catch (error) {
      Logger.error('LocalStrategy error', error);
      throw new UnauthorizedException('Bad id or password');
    }
  }
}
