import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMomentDto } from './dto/create-moment.dto';
import { ReactionType, ReactMomentDto } from './dto/react-moment.dto';
import { MomentsRepository } from './repositories/moments.repository';
import { RedisService } from 'src/redis/redis.service';

function livenessScore(postedAt: Date, expiresAt: Date): number {
  const total = expiresAt.getTime() - postedAt.getTime();
  const elapsed = Date.now() - postedAt.getTime();
  return Math.max(0, Math.min(1, 1 - elapsed / total));
}
@Injectable()
export class MomentsService {
  constructor(private momentsRepository:MomentsRepository,private redis:RedisService){}
 async create(uid:string,dto: CreateMomentDto) {

  if(dto.idempotencyKey){
      const cached = await this.redis.get(`idempotency:${dto.idempotencyKey}`);
      if(cached) return JSON.parse(cached)
  }
    
    const moment=await this.momentsRepository.create(uid,dto);
       // update PostGIS location column via raw SQL
    await this.momentsRepository.updateLocation(moment.id, dto.latitude, dto.longitude);
    if (dto.caption) {
    await this.momentsRepository.extractAndSaveHashtags(moment.id, dto.caption);
  }
    return moment;
  }

async findNearby(lat: number, lng: number, radius: number = 2000, category?: string) {
  const moments=category?
  await this.momentsRepository.findNearbyByCategory(lat,lng,radius,category):
  await this.momentsRepository.findNearby(lat,lng,radius)
    return moments.map((m) => ({
      ...m,
      liveness: livenessScore(new Date(m.createdAt), new Date(m.expiresAt)),
    }));
}

 async findOne(id: string) {
   const moment=await this.momentsRepository.findById(id)
       if (!moment) throw new NotFoundException('Moment not found');
    return moment;
  }

  async findByUser(userId:string){
    return this.momentsRepository.findByUser(userId);
  }
  async react(id: string, dto: ReactMomentDto) {
     await this.findOne(id);

    const field =
      dto.type === ReactionType.GOING
        ? 'goingCount'
        : dto.type === ReactionType.INTERESTED
        ? 'interestedCount'
        : 'likeCount';

    return this.momentsRepository.incrementReaction(id,field)
  }
 

 async remove(id: string,uid:string) {
   const moment=await this.findOne(id);
   
   if(moment.userId!==uid) throw new ForbiddenException("Not your moment")

    return this.momentsRepository.archive(id);}
}
