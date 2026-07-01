export declare class NotificationService {
    private readonly logger;
    sendEmail(to: string, subject: string, body: string): Promise<void>;
    notifySellerShipping(transactionId: string, sellerEmail: string): Promise<void>;
    notifyBuyerConfirmed(transactionId: string, buyerEmail: string): Promise<void>;
    notifyBuyerAutoConfirm(transactionId: string, buyerEmail: string): Promise<void>;
}
