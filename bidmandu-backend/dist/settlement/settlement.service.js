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
exports.SettlementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_service_1 = require("../transaction/transaction.service");
const settlement_batch_entity_1 = require("./entities/settlement-batch.entity");
const transaction_entity_1 = require("../transaction/entities/transaction.entity");
let SettlementService = class SettlementService {
    constructor(batchRepo, txnRepo, transactionService) {
        this.batchRepo = batchRepo;
        this.txnRepo = txnRepo;
        this.transactionService = transactionService;
    }
    async settleTransactions(adminId, transactionIds) {
        const txns = await this.txnRepo.find({
            where: {
                id: (0, typeorm_2.In)(transactionIds),
                status: 'CONFIRMED',
                settlement_batch_id: (0, typeorm_2.IsNull)(),
            },
        });
        if (txns.length === 0)
            throw new Error('No valid transactions to settle');
        const batch = this.batchRepo.create({
            admin_id: adminId,
            status: 'OPEN',
            total_amount: 0,
            total_fee: 0,
        });
        await this.batchRepo.save(batch);
        let totalAmount = 0;
        let totalFee = 0;
        for (const txn of txns) {
            const payout = parseFloat((txn.amount * 0.95).toFixed(2));
            const fee = parseFloat((txn.amount * 0.05).toFixed(2));
            await this.transactionService.markSettled(txn.id, batch.id, payout);
            totalAmount += payout;
            totalFee += fee;
        }
        batch.total_amount = totalAmount;
        batch.total_fee = totalFee;
        batch.status = 'EXPORTED';
        await this.batchRepo.save(batch);
        return batch;
    }
};
exports.SettlementService = SettlementService;
exports.SettlementService = SettlementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(settlement_batch_entity_1.SettlementBatch)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        transaction_service_1.TransactionService])
], SettlementService);
//# sourceMappingURL=settlement.service.js.map