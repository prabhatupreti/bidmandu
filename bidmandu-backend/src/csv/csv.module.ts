import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementBatch } from '../settlement/entities/settlement-batch.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { CsvService } from './csv.service';

@Module({
  imports: [TypeOrmModule.forFeature([SettlementBatch, Transaction])],
  providers: [CsvService],
  exports: [CsvService],
})
export class CsvModule {}