import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { MomentsModule } from './moments/moments.module';
import { envValidationSchema } from './config/env.validation';
import { RedisModule } from './redis/redis.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { JobsModule } from './jobs/jobs.module';
import { BullModule } from '@nestjs/bullmq';
import { TrendingModule } from './trending/trending.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
      envFilePath: '.env', // Tells NestJS where to look for your variables,
      validationSchema:envValidationSchema
    }),
    ThrottlerModule.forRoot([
      {
        name:'global',
        ttl:60000,
        limit:60

      }
    ]),
    BullModule.registerQueue(
      { name: 'expiry' },
      { name: 'trending' },
    ),
    AuthModule,
    DatabaseModule,
     RedisModule,
    UsersModule,
    MomentsModule,
   
    JobsModule,
   
    TrendingModule,
   
    SearchModule],
  controllers: [AppController],
  providers: [{
    provide:APP_GUARD,
    useClass:FirebaseAuthGuard
  },
{
  provide:APP_GUARD,
  useClass:ThrottlerGuard
}
],
})
export class AppModule {}
