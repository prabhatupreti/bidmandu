import { TransactionService } from '../../transaction/transaction.service';
export declare class AdminPaymentQueueController {
    private transactionService;
    constructor(transactionService: TransactionService);
    getPaymentQueue(page?: number, limit?: number): Promise<{
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
    verifyPayment(id: string, req: any, dto: {
        amountMatched: boolean;
        referenceMatched: boolean;
        adminNotes: string;
    }): Promise<import("../../transaction/entities/transaction.entity").Transaction>;
}
