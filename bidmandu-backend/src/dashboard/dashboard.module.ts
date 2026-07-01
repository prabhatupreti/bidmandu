import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Auction } from '../auction/entities/auction.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Auction, Transaction])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}