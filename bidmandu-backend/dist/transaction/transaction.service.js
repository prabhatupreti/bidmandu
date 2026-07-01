"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const transaction_entity_1 = require("./entities/transaction.entity");
const uuid_1 = require("uuid");
let TransactionService = class TransactionService {
    constructor(txnRepo, storage, compressionQueue) {
        this.txnRepo = txnRepo;
        this.storage = storage;
        this.compressionQueue = compressionQueue;
    }
    async findById(id) {
        const txn = await this.txnRepo.findOne({ where: { id }, relations: ['buyer', 'seller', 'auction', 'auction.product'] });
        if (!txn)
            throw new common_1.NotFoundException('Transaction not found');
        return txn;
    }
    async createTransaction(auctionId, buyerId, sellerId, amount) {
        const refCode = `PAY-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
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
    async uploadProof(txnId, userId, file) {
        const txn = await this.txnRepo.findOne({ where: { id: txnId, buyer_id: userId } });
        if (!txn)
            throw new common_1.NotFoundException('Transaction not found');
        if (txn.status !== 'AWAITING_PAYMENT' && txn.status !== 'PROOF_REJECTED') {
            throw new common_1.BadRequestException('Cannot upload proof at this stage');
        }
        const originalUrl = await this.storage.upload(file, `proofs/${txnId}`);
        txn.proof_image_url = originalUrl;
        txn.status = 'PROOF_SUBMITTED';
        await this.txnRepo.save(txn);
        await this.compressionQueue.add('compress', { txnId, originalUrl });
        return { message: 'Proof uploaded and queued for processing' };
    }
    async confirmReceipt(txnId, userId) {
        const txn = await this.txnRepo.findOne({ where: { id: txnId, buyer_id: userId } });
        if (!txn)
            throw new common_1.NotFoundException('Transaction not found');
        if (txn.status !== 'SHIPPED')
            throw new common_1.BadRequestException('Item not shipped yet');
        txn.status = 'CONFIRMED';
        txn.buyer_confirmed_at = new Date();
        await this.txnRepo.save(txn);
        return txn;
    }
    async markShipped(txnId, sellerId, tracking) {
        const txn = await this.txnRepo.findOne({ where: { id: txnId, seller_id: sellerId } });
        if (!txn)
            throw new common_1.NotFoundException('Transaction not found');
        if (txn.status !== 'PAYMENT_VERIFIED')
            throw new common_1.BadRequestException('Payment not verified yet');
        txn.status = 'SHIPPED';
        txn.shipping_details = tracking || null;
        await this.txnRepo.save(txn);
        return txn;
    }
    async adminVerify(txnId, adminId, amountMatched, referenceMatched, adminNotes) {
        const txn = await this.txnRepo.findOne({ where: { id: txnId } });
        if (!txn || txn.status !== 'PROOF_SUBMITTED')
            throw new common_1.BadRequestException('Invalid transaction');
        if (amountMatched && referenceMatched) {
            txn.status = 'PAYMENT_VERIFIED';
            txn.admin_verified_at = new Date();
        }
        else {
            txn.status = 'PROOF_REJECTED';
        }
        txn.admin_notes = adminNotes;
        await this.txnRepo.save(txn);
        return txn;
    }
    async getPaymentQueue(page, limit) {
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
            where: { status: 'CONFIRMED', settlement_batch_id: (0, typeorm_2.IsNull)() },
        });
    }
    async markSettled(txnId, batchId, payout) {
        const txn = await this.txnRepo.findOne({ where: { id: txnId } });
        if (!txn)
            throw new common_1.NotFoundException();
        txn.status = 'SETTLED';
        txn.settlement_batch_id = batchId;
        txn.payout_amount = payout;
        await this.txnRepo.save(txn);
    }
    async getMyTransactions(userId) {
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
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, common_1.Inject)('IStorageService')),
    __param(2, (0, bull_1.InjectQueue)('proof-compression')),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object, Object])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map