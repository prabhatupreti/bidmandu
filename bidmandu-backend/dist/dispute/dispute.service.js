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
exports.DisputeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../transaction/entities/transaction.entity");
let DisputeService = class DisputeService {
    constructor(txnRepo) {
        this.txnRepo = txnRepo;
    }
    async getDisputedTransactions() {
        return this.txnRepo.find({
            where: [
                { status: 'PROOF_REJECTED' },
                { status: 'SHIPPED', buyer_confirmed_at: (0, typeorm_2.IsNull)() },
            ],
            relations: ['buyer', 'seller'],
            order: { updated_at: 'ASC' },
        });
    }
    async adminForceConfirm(txnId, adminId) {
        const txn = await this.txnRepo.findOne({ where: { id: txnId } });
        if (!txn)
            throw new common_1.NotFoundException('Transaction not found');
        if (txn.status !== 'SHIPPED')
            throw new common_1.BadRequestException('Can only force‑confirm shipped items');
        txn.status = 'CONFIRMED';
        txn.buyer_confirmed_at = new Date();
        txn.admin_notes = (txn.admin_notes || '') + ` [Force confirmed by admin ${adminId}]`;
        await this.txnRepo.save(txn);
        return txn;
    }
    async adminResetProof(txnId) {
        const txn = await this.txnRepo.findOne({ where: { id: txnId } });
        if (!txn)
            throw new common_1.NotFoundException('Transaction not found');
        if (txn.status !== 'PROOF_REJECTED')
            throw new common_1.BadRequestException('Not rejected');
        txn.status = 'AWAITING_PAYMENT';
        txn.proof_image_url = null;
        txn.proof_thumb_url = null;
        await this.txnRepo.save(txn);
        return txn;
    }
};
exports.DisputeService = DisputeService;
exports.DisputeService = DisputeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DisputeService);
//# sourceMappingURL=dispute.service.js.map