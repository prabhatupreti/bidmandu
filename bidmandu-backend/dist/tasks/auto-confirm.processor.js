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
exports.AutoConfirmProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../transaction/entities/transaction.entity");
const notification_service_1 = require("../notification/notification.service");
let AutoConfirmProcessor = class AutoConfirmProcessor {
    constructor(txnRepo, notificationService) {
        this.txnRepo = txnRepo;
        this.notificationService = notificationService;
    }
    async handleAutoConfirm(job) {
        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
        const txns = await this.txnRepo.find({
            where: {
                status: 'PAYMENT_VERIFIED',
                admin_verified_at: (0, typeorm_2.LessThan)(fiveDaysAgo),
            },
            relations: ['buyer'],
        });
        for (const txn of txns) {
            txn.status = 'CONFIRMED';
            txn.buyer_confirmed_at = new Date();
            await this.txnRepo.save(txn);
            if (txn.buyer?.email) {
                await this.notificationService.notifyBuyerAutoConfirm(txn.id, txn.buyer.email);
            }
        }
        return { processed: txns.length };
    }
};
exports.AutoConfirmProcessor = AutoConfirmProcessor;
__decorate([
    (0, bull_1.Process)('auto-confirm-receipt'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], AutoConfirmProcessor.prototype, "handleAutoConfirm", null);
exports.AutoConfirmProcessor = AutoConfirmProcessor = __decorate([
    (0, bull_1.Processor)('scheduled-tasks'),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], AutoConfirmProcessor);
//# sourceMappingURL=auto-confirm.processor.js.map