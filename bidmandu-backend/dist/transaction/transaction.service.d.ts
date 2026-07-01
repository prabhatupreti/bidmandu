import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { Transaction } from './entities/transaction.entity';
import { IStorageService } from '../storage/storage.interface';
export declare class TransactionService {
    private txnRepo;
    private storage;
    private compressionQueue;
    constructor(txnRepo: Repository<Transaction>, storage: IStorageService, compressionQueue: Queue);
    findById(id: string): Promise<Transaction>;
    createTransaction(auctionId: string, buyerId: string, sellerId: string, amount: number): Promise<Transaction>;
    uploadProof(txnId: string, userId: string, file: Express.Multer.File): Promise<{
        message: string;
    }>;
    confirmReceipt(txnId: string, userId: string): Promise<Transaction>;
    markShipped(txnId: string, sellerId: string, tracking?: string): Promise<Transaction>;
    adminVerify(txnId: string, adminId: string, amountMatched: boolean, referenceMatched: boolean, adminNotes: string): Promise<Transaction>;
    getPaymentQueue(page: number, limit: number): Promise<{
        items: {
            id: string;
            payment_ref_code: string;
            buyerName: string;
            amount: number;
            proof_thumb_url: string | null;
            status: string;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getTransactionsReadyForSettlement(): Promise<Transaction[]>;
    markSettled(txnId: string, batchId: string, payout: number): Promise<void>;
    getMyTransactions(userId: string): Promise<{
        id: string;
        payment_ref_code: string;
        amount: number;
        status: string;
        created_at: Date;
        auction_id: string;
        product: {
            title: string;
            image_url: string | null;
        };
        seller_alias: string;
        payout_amount: number;
        admin_verified_at: Date;
        buyer_confirmed_at: Date;
    }[]>;
}
