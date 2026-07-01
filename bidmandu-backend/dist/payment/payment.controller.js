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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const transaction_service_1 = require("../transaction/transaction.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const system_config_entity_1 = require("../system-config/entities/system-config.entity");
let PaymentController = class PaymentController {
    constructor(transactionService, systemConfigRepo) {
        this.transactionService = transactionService;
        this.systemConfigRepo = systemConfigRepo;
    }
    async getPaymentDetails(id) {
        const txn = await this.transactionService.findById(id);
        const config = await this.systemConfigRepo.findOne({ where: { key: 'STATIC_QR_URL' } });
        return {
            staticQrUrl: config?.value || '/assets/qr.jpg',
            accountName: 'Bidmandu Escrow',
            amountDue: txn.amount,
            paymentRef: txn.payment_ref_code,
            instructions: 'Scan the QR using any UPI/Bank app and enter the reference in remarks.',
        };
    }
    async uploadProof(id, file, req) {
        return this.transactionService.uploadProof(id, req.user.id, file);
    }
    async confirmReceipt(id, req) {
        return this.transactionService.confirmReceipt(id, req.user.id);
    }
    async markShipped(id, tracking, req) {
        return this.transactionService.markShipped(id, req.user.id, tracking);
    }
    async getMyTransactions(req) {
        return this.transactionService.getMyTransactions(req.user.id);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Get)(':id/payment-details'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentDetails", null);
__decorate([
    (0, common_1.Post)(':id/proof'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('proof', { storage: (0, multer_1.memoryStorage)(), limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "uploadProof", null);
__decorate([
    (0, common_1.Post)(':id/confirm-receipt'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "confirmReceipt", null);
__decorate([
    (0, common_1.Post)(':id/ship'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('tracking')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "markShipped", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getMyTransactions", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('transactions'),
    __param(1, (0, typeorm_1.InjectRepository)(system_config_entity_1.SystemConfig)),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        typeorm_2.Repository])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map