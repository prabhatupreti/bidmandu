import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Auction } from '../auction/entities/auction.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
export declare class DashboardService {
    private userRepo;
    private productRepo;
    private auctionRepo;
    private txnRepo;
    constructor(userRepo: Repository<User>, productRepo: Repository<Product>, auctionRepo: Repository<Auction>, txnRepo: Repository<Transaction>);
    getStats(): Promise<{
        totalUsers: number;
        totalSellers: number;
        totalProducts: number;
        activeAuctions: number;
        completedTransactions: number;
        totalRevenue: number;
    }>;
}
