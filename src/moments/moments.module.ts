import { Module } from '@nestjs/common';
import { MomentsService } from './moments.service';
import { MomentsController } from './moments.controller';
import { MomentsRepository } from './repositories/moments.repository';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [MomentsController],
  providers: [MomentsService,MomentsRepository,RedisService],
   exports: [MomentsService,MomentsRepository],
})
export class MomentsModule {}
