import { Repository } from 'typeorm';
import { TransactionService } from '../transaction/transaction.service';
import { SettlementBatch } from './entities/settlement-batch.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
export declare class SettlementService {
    private batchRepo;
    private txnRepo;
    private transactionService;
    constructor(batchRepo: Repository<SettlementBatch>, txnRepo: Repository<Transaction>, transactionService: TransactionService);
    settleTransactions(adminId: string, transactionIds: string[]): Promise<SettlementBatch>;
}
