import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit,OnModuleDestroy {

    private client!:Redis;
    constructor(private config:ConfigService){}

    onModuleInit() {
        this.client=new Redis(this.config.get<string>('REDIS_URL')!)
        this.client.on('connect',()=>console.log('Redis connected'))
        this.client.on('destroy',(error)=>console.log('Redis error',error))
    }

    onModuleDestroy() {
        this.client.disconnect()
    }

    async get(key:string):Promise<string|null>{
        return this.client.get(key);
    }

    async set(key:string,value:string,ttlSeconds?:number):Promise<void>{
        if(ttlSeconds){
          await  this.client.set(key,value,'EX',ttlSeconds)
        }
        else{
            await this.client.set(key,value);
        }
        
    }
    async delete(key:string):Promise<void>{
        await this.client.del(key);
    }

    async increment(key:string):Promise<number>{
       return  this.client.incr(key);
    }

    async expire(key:string,ttlSeconds:number):Promise<void>{
        await this.client.expire(key,ttlSeconds);
    }

    async exists(key:string):Promise<boolean>{
        const result=await this.client.exists(key);
        return result==1;
    }
}
