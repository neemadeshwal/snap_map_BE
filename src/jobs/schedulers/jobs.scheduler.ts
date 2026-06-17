import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { Cron } from '@nestjs/schedule';


@Injectable()
export class JobsScheduler{
    private readonly logger=new Logger(JobsScheduler.name);

    constructor(
        @InjectQueue('expiry') private expiryQueue:Queue,
        @InjectQueue('trending') private trendingQueue:Queue
    ){}

    @Cron('*/15 * * * *')
    async scheduleExpiryJob(){
        await this.expiryQueue.add('expire-moments',{})
        this.logger.log('Expiry job queued')
    }

    @Cron('*/30 * * * *')
    async scheduleTrendingJob(){
        await this.trendingQueue.add('calculate-trending',{});
        this.logger.log('Expiry job queued')
    }
}