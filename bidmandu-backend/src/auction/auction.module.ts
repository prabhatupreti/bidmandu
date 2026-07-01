import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { AuctionActionsController } from './auction-actions.controller';
import { AuctionEndProcessor } from './processors/auction-end.processor';
import { RedisService } from '../redis/redis.service';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Bid]),
    BullModule.registerQueue({ name: 'auction-end' }),
    TransactionModule,
  ],
  providers: [AuctionService, RedisService, AuctionEndProcessor],
  controllers: [AuctionController, AuctionActionsController],
  exports: [AuctionService],
})
export class AuctionModule {}