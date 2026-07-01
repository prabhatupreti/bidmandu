import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Transaction } from './entities/transaction.entity';
import { IStorageService } from '../storage/storage.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private txnRepo: Repository<Transaction>,
    @Inject('IStorageService') private storage: IStorageService,
    @InjectQueue('proof-compression') private compressionQueue: Queue,
  ) {}

  async findById(id: string) {
    const txn = await this.txnRepo.findOne({ where: { id }, relations: ['buyer', 'seller', 'auction', 'auction.product'] });
    if (!txn) throw new NotFoundException('Transaction not found');
    return txn;
  }

  async createTransaction(auctionId: string, buyerId: string, sellerId: string, amount: number) {
    const refCode = `PAY-${uuid().slice(0, 8).toUpperCase()}`;
    const txn = this.txnRepo.create({
      auction_id: auctionId,
      buyer_id: buyerId,
      seller_id: sellerId,
      amount,
      payment_ref_code: refCode,
      status: 'AWAITING_PAYMENT',
    });
    return this.txnRepo.save(txn);
  }

  async uploadProof(txnId: string, userId: string, file: Express.Multer.File) {
    const txn = await this.txnRepo.findOne({ where: { id: txnId, buyer_id: userId } });
    if (!txn) throw new NotFoundException('Transaction not found');
    if (txn.status !== 'AWAITING_PAYMENT' && txn.status !== 'PROOF_REJECTED') {
      throw new BadRequestException('Cannot upload proof at this stage');
    }

    const originalUrl = await this.storage.upload(file, `proofs/${txnId}`);
    txn.proof_image_url = originalUrl;
    txn.status = 'PROOF_SUBMITTED';
    await this.txnRepo.save(txn);

    await this.compressionQueue.add('compress', { txnId, originalUrl });

    return { message: 'Proof uploaded and queued for processing' };
  }

  async confirmReceipt(txnId: string, userId: string) {
    const txn = await this.txnRepo.findOne({ where: { id: txnId, buyer_id: userId } });
    if (!txn) throw new NotFoundException('Transaction not found');
    if (txn.status !== 'SHIPPED') throw new BadRequestException('Item not shipped yet');
    txn.status = 'CONFIRMED';
    txn.buyer_confirmed_at = new Date();
    await this.txnRepo.save(txn);
    return txn;
  }

  async markShipped(txnId: string, sellerId: string, tracking?: string) {
    const txn = await this.txnRepo.findOne({ where: { id: txnId, seller_id: sellerId } });
    if (!txn) throw new NotFoundException('Transaction not found');
    if (txn.status !== 'PAYMENT_VERIFIED') throw new BadRequestException('Payment not verified yet');
    txn.status = 'SHIPPED';
    txn.shipping_details = tracking || null;
    await this.txnRepo.save(txn);
    return txn;
  }

  async adminVerify(txnId: string, adminId: string, amountMatched: boolean, referenceMatched: boolean, adminNotes: string) {
    const txn = await this.txnRepo.findOne({ where: { id: txnId } });
    if (!txn || txn.status !== 'PROOF_SUBMITTED') throw new BadRequestException('Invalid transaction');
    if (amountMatched && referenceMatched) {
      txn.status = 'PAYMENT_VERIFIED';
      txn.admin_verified_at = new Date();
    } else {
      txn.status = 'PROOF_REJECTED';
    }
    txn.admin_notes = adminNotes;
    await this.txnRepo.save(txn);
    return txn;
  }

  async getPaymentQueue(page: number, limit: number) {
    const [items, total] = await this.txnRepo.findAndCount({
      where: { status: 'PROOF_SUBMITTED' },
      relations: ['buyer', 'seller'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'ASC' },
    });
    return {
      items: items.map(t => ({
        id: t.id,
        payment_ref_code: t.payment_ref_code,
        buyerName: t.buyer.email,
        amount: t.amount,
        proof_thumb_url: t.proof_thumb_url,
        status: t.status,
      })),
      total,
      page,
      limit,
    };
  }

  async getTransactionsReadyForSettlement() {
    return this.txnRepo.find({
      where: { status: 'CONFIRMED', settlement_batch_id: IsNull() },
    });
  }

  async markSettled(txnId: string, batchId: string, payout: number) {
    const txn = await this.txnRepo.findOne({ where: { id: txnId } });
    if (!txn) throw new NotFoundException();
    txn.status = 'SETTLED';
    txn.settlement_batch_id = batchId;
    txn.payout_amount = payout;
    await this.txnRepo.save(txn);
  }

  // Enhanced: return product & seller alias
  async getMyTransactions(userId: string) {
    const txns = await this.txnRepo.find({
      where: [
        { buyer_id: userId },
        { seller_id: userId },
      ],
      relations: ['auction', 'auction.product', 'buyer', 'seller'],
      order: { created_at: 'DESC' },
    });

    return txns.map(txn => ({
      id: txn.id,
      payment_ref_code: txn.payment_ref_code,
      amount: txn.amount,
      status: txn.status,
      created_at: txn.created_at,
      auction_id: txn.auction_id,
      product: {
        title: txn.auction?.product?.title,
        image_url: txn.auction?.product?.image_urls?.[0] || null,
      },
      seller_alias: txn.seller ? `BM-${txn.seller_id.substring(0, 4).toUpperCase()}` : 'Unknown',
      payout_amount: txn.payout_amount,
      admin_verified_at: txn.admin_verified_at,
      buyer_confirmed_at: txn.buyer_confirmed_at,
    }));
  }
}