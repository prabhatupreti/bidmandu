import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { NotificationService } from '../notification/notification.service';

@Processor('scheduled-tasks')
export class AutoConfirmProcessor {
  constructor(
    @InjectRepository(Transaction)
    private txnRepo: Repository<Transaction>,
    private notificationService: NotificationService,
  ) {}

  // This job runs every hour (configured when we add the repeatable job)
  @Process('auto-confirm-receipt')
  async handleAutoConfirm(job: Job) {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    const txns = await this.txnRepo.find({
      where: {
        status: 'PAYMENT_VERIFIED',
        admin_verified_at: LessThan(fiveDaysAgo),
      },
      relations: ['buyer'],
    });

    for (const txn of txns) {
      txn.status = 'CONFIRMED';
      txn.buyer_confirmed_at = new Date();
      await this.txnRepo.save(txn);
      // Notify buyer
      if (txn.buyer?.email) {
        await this.notificationService.notifyBuyerAutoConfirm(txn.id, txn.buyer.email);
      }
    }

    return { processed: txns.length };
  }
}