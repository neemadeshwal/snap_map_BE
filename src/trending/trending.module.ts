import { Module } from '@nestjs/common';
import { TrendingService } from './trending.service';
import { TrendingController } from './trending.controller';
import { MomentsModule } from 'src/moments/moments.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [MomentsModule,RedisModule],
  controllers: [TrendingController],
  providers: [TrendingService],
})
export class TrendingModule {}
