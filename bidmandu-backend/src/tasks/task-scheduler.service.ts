import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TaskSchedulerService implements OnModuleInit {
  constructor(@InjectQueue('scheduled-tasks') private scheduledQueue: Queue) {}

  async onModuleInit() {
    // Remove existing repeatable jobs to avoid duplicates
    const repeatable = await this.scheduledQueue.getRepeatableJobs();
    for (const job of repeatable) {
      await this.scheduledQueue.removeRepeatableByKey(job.key);
    }

    // Add repeatable job using cron, not pattern
    await this.scheduledQueue.add(
      'auto-confirm-receipt',
      {},
      {
        repeat: { cron: '0 * * * *' },   // every hour at minute 0
        jobId: 'auto-confirm-receipt-repeat',
      },
    );
  }
}