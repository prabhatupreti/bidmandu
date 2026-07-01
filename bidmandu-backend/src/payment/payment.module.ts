import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { SystemConfigModule } from '../system-config/system-config.module';

@Module({
  imports: [TransactionModule, SystemConfigModule],
  controllers: [PaymentController],
})
export class PaymentModule {}