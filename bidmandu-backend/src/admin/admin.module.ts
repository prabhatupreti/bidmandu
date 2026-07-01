import { Module } from '@nestjs/common';
import { KycQueueController } from './controllers/kyc-queue.controller';
import { AdminProductQueueController } from './controllers/product-queue.controller';
import { AdminPaymentQueueController } from './controllers/payment-queue.controller';
import { AdminSettlementController } from './controllers/settlement.controller';
import { AdminDisputeController } from './controllers/dispute.controller';
import { SellerVerificationModule } from '../seller-verification/seller-verification.module';
import { ProductModule } from '../product/product.module';
import { TransactionModule } from '../transaction/transaction.module';
import { SettlementModule } from '../settlement/settlement.module';
import { DisputeModule } from '../dispute/dispute.module';
import { CsvModule } from '../csv/csv.module';

@Module({
  imports: [
    SellerVerificationModule,
    ProductModule,
    TransactionModule,
    SettlementModule,
    DisputeModule,
    CsvModule,
  ],
  controllers: [
    KycQueueController,
    AdminProductQueueController,
    AdminPaymentQueueController,
    AdminSettlementController,
    AdminDisputeController,
  ],
})
export class AdminModule {}