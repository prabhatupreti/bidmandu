import { Repository } from 'typeorm';
import { SettlementBatch } from '../settlement/entities/settlement-batch.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
export declare class CsvService {
    private batchRepo;
    private txnRepo;
    constructor(batchRepo: Repository<SettlementBatch>, txnRepo: Repository<Transaction>);
    generateSettlementCsv(batchId: string): Promise<string>;
}
