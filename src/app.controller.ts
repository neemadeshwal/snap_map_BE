import { Controller, Get, Req } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import express from 'express';

@Controller()
export class AppController {

  @Public()
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('me')
  me(@Req() req: express.Request) {
    return { uid: req.user.uid, email: req.user.email };
  }
}
