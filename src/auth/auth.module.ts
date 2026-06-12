import { Module } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Module({
  imports:[ConfigModule],
  providers: [FirebaseAdminService,FirebaseAuthGuard],
   exports: [FirebaseAdminService,FirebaseAuthGuard],
})
export class AuthModule {}
