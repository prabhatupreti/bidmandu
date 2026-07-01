import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { NotificationService } from '../notification/notification.service';
export declare class AutoConfirmProcessor {
    private txnRepo;
    private notificationService;
    constructor(txnRepo: Repository<Transaction>, notificationService: NotificationService);
    handleAutoConfirm(job: Job): Promise<{
        processed: number;
    }>;
}
