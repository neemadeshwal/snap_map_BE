import { Module } from '@nestjs/common';
import { MomentsService } from './moments.service';
import { MomentsController } from './moments.controller';
import { MomentsRepository } from './repositories/moments.repository';

@Module({
  controllers: [MomentsController],
  providers: [MomentsService,MomentsRepository],
   exports: [MomentsService,MomentsRepository],
})
export class MomentsModule {}
