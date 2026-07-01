import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { ProofCompressionProcessor } from './processors/proof-compression.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    BullModule.registerQueue({ name: 'proof-compression' }),
  ],
  providers: [TransactionService, ProofCompressionProcessor],
  exports: [TransactionService],  // <-- must be exported
})
export class TransactionModule {}