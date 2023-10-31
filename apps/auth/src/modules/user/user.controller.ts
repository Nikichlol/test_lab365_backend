import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

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
