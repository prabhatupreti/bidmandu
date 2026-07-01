import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Auction } from '../entities/auction.entity';
import { RedisService } from '../../redis/redis.service';
import { TransactionService } from '../../transaction/transaction.service';
export declare class AuctionEndProcessor {
    private auctionRepo;
    private redisService;
    private transactionService;
    constructor(auctionRepo: Repository<Auction>, redisService: RedisService, transactionService: TransactionService);
    handleEndAuction(job: Job<{
        auctionId: string;
    }>): Promise<void>;
}
