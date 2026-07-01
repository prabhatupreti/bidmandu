import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementBatch } from './entities/settlement-batch.entity';
import { SettlementService } from './settlement.service';
import { TransactionModule } from '../transaction/transaction.module';
import { Transaction } from '../transaction/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SettlementBatch, Transaction]), TransactionModule],
  providers: [SettlementService],
  exports: [SettlementService],
})
export class SettlementModule {}