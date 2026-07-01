import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { TransactionService } from '../transaction/transaction.service';
import { SettlementBatch } from './entities/settlement-batch.entity';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class SettlementService {
  constructor(
    @InjectRepository(SettlementBatch)
    private batchRepo: Repository<SettlementBatch>,
    @InjectRepository(Transaction)
    private txnRepo: Repository<Transaction>,
    private transactionService: TransactionService,
  ) {}

  async settleTransactions(adminId: string, transactionIds: string[]) {
    const txns = await this.txnRepo.find({
      where: {
        id: In(transactionIds),
        status: 'CONFIRMED',
        settlement_batch_id: IsNull(),   // fixed: use IsNull()
      },
    });
    if (txns.length === 0) throw new Error('No valid transactions to settle');

    const batch = this.batchRepo.create({
      admin_id: adminId,
      status: 'OPEN',
      total_amount: 0,
      total_fee: 0,
    });
    await this.batchRepo.save(batch);

    let totalAmount = 0;
    let totalFee = 0;

    for (const txn of txns) {
      const payout = parseFloat((txn.amount * 0.95).toFixed(2));
      const fee = parseFloat((txn.amount * 0.05).toFixed(2));
      await this.transactionService.markSettled(txn.id, batch.id, payout);
      totalAmount += payout;
      totalFee += fee;
    }

    batch.total_amount = totalAmount;
    batch.total_fee = totalFee;
    batch.status = 'EXPORTED';
    await this.batchRepo.save(batch);

    return batch;
  }
}