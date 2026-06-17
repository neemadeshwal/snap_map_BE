import { Controller, Get, Post, Req } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import express from 'express';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DatabaseService } from './database/database.service';
import { RedisService } from './redis/redis.service';
import { timestamp } from 'rxjs';

@Controller()
export class AppController {
constructor(
    @InjectQueue('expiry') private expiryQueue: Queue,
    @InjectQueue('trending') private trendingQueue: Queue,
     private db: DatabaseService,
    private redis: RedisService,
  ) {
    
  }
  @Public()
  @Get('health')
async  health() {
   let database='ok';
   let redisStatus='ok';

   try{
        await this.db.$queryRaw`SELECT 1`;
   }
   catch{
    database='error';
   }
   try{
      await this.redis.set('health', 'ok', 10);
    
   }
   catch{
    redisStatus='error';
   }
   return {
    status:database==='ok'&&redisStatus==='ok'?'ok':'degraded',
    database,
    redis:redisStatus,
    timestamp:new Date()

   }
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
