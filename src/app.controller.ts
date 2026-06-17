import { Controller, Get, Post, Req } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import express from 'express';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller()
export class AppController {
constructor(
    @InjectQueue('expiry') private expiryQueue: Queue,
    @InjectQueue('trending') private trendingQueue: Queue,
  ) {}
  @Public()
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('me')
  me(@Req() req: express.Request) {
    return { uid: req.user.uid, email: req.user.email };
  }
  @Public()
  @Post('test/expiry')
  async testExpiry() {
    await this.expiryQueue.add('expire-moments', {});
    return { message: 'Expiry job queued' };
  }

  @Public()
  @Post('test/trending')
  async testTrending() {
    await this.trendingQueue.add('calculate-trending', {});
    return { message: 'Trending job queued' };
  }
}
