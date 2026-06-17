import { Injectable } from '@nestjs/common';
import { MomentsRepository } from 'src/moments/repositories/moments.repository';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TrendingService {
    constructor(
        private redis : RedisService,
        private momentsRepository:MomentsRepository
    ){}

    async getTrending(){

        const cached= await this.redis.get('trending:global');

        if(cached){
            return JSON.parse(cached);
        }

        const moments=await this.momentsRepository.findAllActive();

        moments.map((m)=>{
            const total=m.expiresAt.getTime()-m.createdAt.getTime();
            const elapsed=Date.now()-m.expiresAt.getTime();
            const liveness=Math.max(0,Math.min(1,1-elapsed/total));
            const freshnessBonus=liveness>0.8?1.5:1;

            const trendScore= m.goingCount*3+m.interestedCount*1+m.likeCount*0.5+freshnessBonus*10;

            return {...m,trendScore}
        })
        .sort((a,b)=>b.trendScore-a.trendScore)
        .slice(0,20)

    }
}
