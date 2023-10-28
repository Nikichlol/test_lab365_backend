import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor() {}

  @Get()
  async signup(@Req() { currentUser }: Request) {
    return {
      id: currentUser.id,
    };
  }
}
