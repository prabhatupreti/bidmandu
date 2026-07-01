import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ETagInterceptor implements NestInterceptor {
  constructor(private redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (request.method !== 'GET') return next.handle();

    const auctionId = request.params.id;
    if (!auctionId) return next.handle();

    const version = await this.redisService.get(`auction:${auctionId}:version`);
    const ifNoneMatch = request.headers['if-none-match'];
    if (ifNoneMatch && ifNoneMatch === `"${version}"`) {
      throw new HttpException('Not Modified', 304);
    }

    const response = context.switchToHttp().getResponse();
    response.setHeader('ETag', `"${version}"`);
    return next.handle();
  }
}