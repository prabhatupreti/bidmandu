import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Auction } from '../auction/entities/auction.entity';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Auction) private auctionRepo: Repository<Auction>,
    @InjectRepository(Transaction) private txnRepo: Repository<Transaction>,
  ) {}

  async getStats() {
    const totalUsers = await this.userRepo.count();
    const totalSellers = await this.userRepo.count({ where: { is_seller: true } });
    const totalProducts = await this.productRepo.count();
    const activeAuctions = await this.auctionRepo.count({ where: { status: 'ACTIVE' } });
    const completedTransactions = await this.txnRepo.count({ where: { status: 'SETTLED' } });

    // Calculate total revenue (5% fee)
    const settledTxns = await this.txnRepo.find({ where: { status: 'SETTLED' } });
    const revenue = settledTxns.reduce((sum, txn) => sum + (txn.amount - (txn.payout_amount || 0)), 0);

    return {
      totalUsers,
      totalSellers,
      totalProducts,
      activeAuctions,
      completedTransactions,
      totalRevenue: revenue,
    };
  }
}