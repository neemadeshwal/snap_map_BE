import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FirebaseAdminService } from './firebase-admin.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from './public.decorator';

@Injectable()
export class FirebaseAuthGuard implements CanActivate{

  constructor(
    private firebaseAdmin:FirebaseAdminService,
    private reflector :Reflector
  ){}

 async canActivate(context: ExecutionContext): Promise<boolean> {
    
  const isPublic=this.reflector.getAllAndOverride<boolean>(IS_PUBLIC,[
    context.getHandler(),
    context.getClass(),
  ])

  if(isPublic) return true;
  const request=context.switchToHttp().getRequest();
  const authHeader=request.headers['authorization'];

  if(!authHeader||!authHeader.startsWith('Bearer ')){
    throw new UnauthorizedException("No token provided")
  }
  const token=authHeader.split('Bearer ')[1];

  try{
    const decoded=await this.firebaseAdmin.verifyToken(token);
    request.user={
      uid:decoded.uid,
      email:decoded.email
    }
    return true;

  }
  catch(e){
    throw new UnauthorizedException('Invalid or expired token');
  }

  }
}

