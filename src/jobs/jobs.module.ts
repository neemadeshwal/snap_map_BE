import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MomentsModule } from 'src/moments/moments.module';
import { ExpiryProcessor } from './processors/expiry.processor';
import { TrendingProcessor } from './processors/trending.processor';
import { JobsScheduler } from './schedulers/jobs.scheduler';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.get<string>('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      {
        name: 'expiry',
      },
      {
        name: 'trending',
      },
    ),
    ScheduleModule.forRoot(),
    MomentsModule,
    RedisModule
  ],
  providers: [ExpiryProcessor, TrendingProcessor, JobsScheduler],

  exports: [BullModule],
})
export class JobsModule {}
