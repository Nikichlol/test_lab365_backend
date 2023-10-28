import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.schema';
import { Payload } from 'src/types/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const userId = (await this.userService.create(createUserDto)).id;

    const token = this.encryptJwt({ userId });

    return {
      id: userId,
      token,
    };
  }

  async signin({ id }: User) {
    const token = this.encryptJwt({ userId: id });

    return {
      token,
    };
  }

  private encryptJwt(payload: Payload) {
    return this.jwtService.sign(payload);
  }
}
