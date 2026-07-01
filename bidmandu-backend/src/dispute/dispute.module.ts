import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { DisputeService } from './dispute.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [DisputeService],
  exports: [DisputeService],
})
export class DisputeModule {}