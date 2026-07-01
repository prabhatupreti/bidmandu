import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { AutoConfirmProcessor } from './auto-confirm.processor';
import { TaskSchedulerService } from './task-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    BullModule.registerQueue({ name: 'scheduled-tasks' }),
  ],
  providers: [AutoConfirmProcessor, TaskSchedulerService],
})
export class TasksModule {}