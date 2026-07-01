import { Repository } from 'typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
export declare class DisputeService {
    private txnRepo;
    constructor(txnRepo: Repository<Transaction>);
    getDisputedTransactions(): Promise<Transaction[]>;
    adminForceConfirm(txnId: string, adminId: string): Promise<Transaction>;
    adminResetProof(txnId: string): Promise<Transaction>;
}
