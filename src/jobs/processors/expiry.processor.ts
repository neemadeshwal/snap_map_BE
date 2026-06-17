import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { MomentsRepository } from "src/moments/repositories/moments.repository";


@Injectable()
@Processor('expiry')
export class ExpiryProcessor extends WorkerHost{

    private readonly logger=new Logger(ExpiryProcessor.name)

    constructor(private momentsRepository:MomentsRepository){
        super();
    }

    async process(job: Job, token?: string): Promise<void> {
         this.logger.log('Running expiry job...');

         const expired=await this.momentsRepository.findExpired();

         for(const moment of expired){
            await this.momentsRepository.archive(moment.id);
         }
             this.logger.log(`Archived ${expired.length} expired moments`);

    }

}