import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MomentsRepository } from 'src/moments/repositories/moments.repository';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
@Processor('trending')
export class TrendingProcessor extends WorkerHost {
  private readonly logger = new Logger(TrendingProcessor.name);

  constructor(
    private momentRepository: MomentsRepository,
    private redis: RedisService,
  ) {
    super();
  }
  async process(job: Job, token?: string): Promise<void> {
    this.logger.log('Running trending job..........');
    const moments = await this.momentRepository.findAllActive();

    const scored = moments
      .map((m) => {
        const total = m.expiresAt.getTime() - m.createdAt.getTime();
        const elapsed = Date.now() - m.createdAt.getTime();
        const liveness = Math.max(0, Math.min(1, 1 - elapsed / total));
        const freshnessBonus = liveness > 0.8 ? 1.5 : 1.0;

        const trendScore =
          m.goingCount * 3 +
          m.interestedCount * 1 +
          m.likeCount * 0.5 +
          freshnessBonus * 10;

        return { ...m, trendScore };
      })
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 20);

    await this.redis.set('trending:global', JSON.stringify(scored), 1800);
    this.logger.log(`Cached ${scored.length} trending moments`);
  }
}
