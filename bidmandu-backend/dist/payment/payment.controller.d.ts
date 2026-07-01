import { TransactionService } from '../transaction/transaction.service';
import { Repository } from 'typeorm';
import { SystemConfig } from '../system-config/entities/system-config.entity';
export declare class PaymentController {
    private transactionService;
    private systemConfigRepo;
    constructor(transactionService: TransactionService, systemConfigRepo: Repository<SystemConfig>);
    getPaymentDetails(id: string): Promise<{
        staticQrUrl: string;
        accountName: string;
        amountDue: number;
        paymentRef: string;
        instructions: string;
    }>;
    uploadProof(id: string, file: Express.Multer.File, req: any): Promise<{
        message: string;
    }>;
    confirmReceipt(id: string, req: any): Promise<import("../transaction/entities/transaction.entity").Transaction>;
    markShipped(id: string, tracking: string, req: any): Promise<import("../transaction/entities/transaction.entity").Transaction>;
    getMyTransactions(req: any): Promise<{
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
