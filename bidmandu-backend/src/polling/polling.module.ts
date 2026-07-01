import { Module } from '@nestjs/common';
import { PollingController } from './polling.controller';
import { ETagInterceptor } from './etag.interceptor';
import { AuctionModule } from '../auction/auction.module';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [AuctionModule],
  controllers: [PollingController],
  providers: [ETagInterceptor, RedisService],
})
export class PollingModule {}