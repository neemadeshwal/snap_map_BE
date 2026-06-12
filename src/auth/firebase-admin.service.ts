import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  constructor(private config: ConfigService) {}
  onModuleInit() {
    if (!getApps().length) {
      try {
        const privateKey = this.config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
        initializeApp({
          credential: cert({
             projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
            clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
            privateKey:privateKey
            
          }),
        });
        console.log('🔥 Firebase Admin SDK initialized successfully.');
      } catch (e) {
        console.error('❌ Failed to initialize Firebase Admin SDK:', e);
        throw new InternalServerErrorException(
          'Firebase initialization failed',
        );
      }
    }
  }
  async verifyToken(token: string): Promise<DecodedIdToken> {
    try {
      return getAuth().verifyIdToken(token);
    } catch (error) {
      throw new InternalServerErrorException(
        'Invalid or expired Firebase token',
      );
    }
  }
}
