import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../redis/redis.service';
export declare class ETagInterceptor implements NestInterceptor {
    private redisService;
    constructor(redisService: RedisService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
