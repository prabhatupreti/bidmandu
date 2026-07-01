import { Job } from 'bull';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { IStorageService } from '../../storage/storage.interface';
export declare class ProofCompressionProcessor {
    private txnRepo;
    private storage;
    constructor(txnRepo: Repository<Transaction>, storage: IStorageService);
    handleCompression(job: Job<{
        txnId: string;
        originalUrl: string;
    }>): Promise<void>;
}
