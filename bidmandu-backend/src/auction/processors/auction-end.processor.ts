import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from '../entities/auction.entity';
import { RedisService } from '../../redis/redis.service';
import { TransactionService } from '../../transaction/transaction.service';
import { Product } from '../../product/entities/product.entity';

@Processor('auction-end')
export class AuctionEndProcessor {
  constructor(
    @InjectRepository(Auction) private auctionRepo: Repository<Auction>,
    private redisService: RedisService,
    private transactionService: TransactionService,
  ) {}

  @Process('end-auction')
  async handleEndAuction(job: Job<{ auctionId: string }>) {
    const { auctionId } = job.data;
    const auction = await this.auctionRepo.findOne({ where: { id: auctionId }, relations: ['product', 'product.seller'] });
    if (!auction || auction.status !== 'ACTIVE') return;

    const winnerId = await this.redisService.get(`auction:${auctionId}:winner`);
    const finalPrice = await this.redisService.get(`auction:${auctionId}:price`);

    auction.status = 'COMPLETED';
    auction.winner_id = winnerId || null;
    auction.current_price = parseFloat(finalPrice || '0');
    await this.auctionRepo.save(auction);

    if (winnerId) {
      await this.transactionService.createTransaction(
        auctionId,
        winnerId,
        auction.product.seller_id,
        parseFloat(finalPrice || '0'),
      );
    }
  }
}