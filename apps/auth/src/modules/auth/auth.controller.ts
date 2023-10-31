import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import { SkipAuth } from './skip-auth.decorator';
import { IncomingHttpHeaders } from 'http';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';

@SkipAuth()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() { currentUser }: Request) {
    return this.authService.signin(currentUser);
  }

  @MessagePattern({ cmd: 'validate_user' })
  async validateUser(headers: IncomingHttpHeaders) {
    return this.authService.validateUserToken(headers).catch(() => false);
  }
}
