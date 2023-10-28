import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'id',
    });
  }

  async validate(id: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findById(id);
      if (!user || user.password !== password) throw new Error();

      return user;
    } catch (error) {
      throw new UnauthorizedException('Bad id or password');
    }
  }
}
