import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { Product } from '../product/entities/product.entity';
import { RedisService } from '../redis/redis.service';
import { TransactionService } from '../transaction/transaction.service';
export declare class AuctionService {
    private auctionRepo;
    private bidRepo;
    private redisService;
    private auctionEndQueue;
    private transactionService;
    constructor(auctionRepo: Repository<Auction>, bidRepo: Repository<Bid>, redisService: RedisService, auctionEndQueue: Queue, transactionService: TransactionService);
    createAuction(product: Product): Promise<Auction>;
    placeBid(userId: string, auctionId: string, amount: number): Promise<{
        success: boolean;
        newPrice: number;
    }>;
    getAuctionState(auctionId: string): Promise<{
        currentPrice: string;
        winnerId: string;
        endTime: Date | null;
        version: string;
    }>;
    getActiveAuctions(userId?: string): Promise<{
        totalBids: number;
        id: string;
        product: Product;
        product_id: string;
        current_price: number;
        start_time: Date;
        end_time: Date;
        soft_close_window: number;
        extension_count: number;
        status: string;
        winner_id: string | null;
    }[]>;
    acceptBid(auctionId: string, sellerId: string, bidId: string): Promise<{
        auction: Auction;
        transaction: import("../transaction/entities/transaction.entity").Transaction;
    }>;
}
