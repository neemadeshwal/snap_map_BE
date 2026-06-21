import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function excludeFields(obj: any, fields: string[]): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => excludeFields(item, fields));
  }
  if (obj && typeof obj === 'object') {
    const cleaned = { ...obj };
    fields.forEach((f) => delete cleaned[f]);
    return cleaned;
  }
  return obj;
}

@Injectable()
export class ExcludeFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => excludeFields(data, ['location'])),
    );
  }
}