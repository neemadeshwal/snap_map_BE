import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
      envFilePath: '.env', // Tells NestJS where to look for your variables
    }),
    AuthModule],
  controllers: [AppController],
  providers: [{
    provide:APP_GUARD,
    useClass:FirebaseAuthGuard
  }],
})
export class AppModule {}
