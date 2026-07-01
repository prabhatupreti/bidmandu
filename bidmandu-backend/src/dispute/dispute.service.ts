import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class DisputeService {
  constructor(
    @InjectRepository(Transaction) private txnRepo: Repository<Transaction>,
  ) {}

  async getDisputedTransactions() {
    return this.txnRepo.find({
      where: [
        { status: 'PROOF_REJECTED' },
        { status: 'SHIPPED', buyer_confirmed_at: IsNull() },  // fixed
      ],
      relations: ['buyer', 'seller'],
      order: { updated_at: 'ASC' },
    });
  }

  async adminForceConfirm(txnId: string, adminId: string) {
    const txn = await this.txnRepo.findOne({ where: { id: txnId } });
    if (!txn) throw new NotFoundException('Transaction not found');
    if (txn.status !== 'SHIPPED') throw new BadRequestException('Can only force‑confirm shipped items');
    txn.status = 'CONFIRMED';
    txn.buyer_confirmed_at = new Date();
    txn.admin_notes = (txn.admin_notes || '') + ` [Force confirmed by admin ${adminId}]`;
    await this.txnRepo.save(txn);
    return txn;
  }

  async adminResetProof(txnId: string) {
    const txn = await this.txnRepo.findOne({ where: { id: txnId } });
    if (!txn) throw new NotFoundException('Transaction not found');
    if (txn.status !== 'PROOF_REJECTED') throw new BadRequestException('Not rejected');
    txn.status = 'AWAITING_PAYMENT';
    txn.proof_image_url = null;   // now allowed because entity type is string | null
    txn.proof_thumb_url = null;
    await this.txnRepo.save(txn);
    return txn;
  }
}