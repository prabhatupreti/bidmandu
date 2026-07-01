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
exports.AdminPaymentQueueController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const transaction_service_1 = require("../../transaction/transaction.service");
let AdminPaymentQueueController = class AdminPaymentQueueController {
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    async getPaymentQueue(page = 1, limit = 20) {
        return this.transactionService.getPaymentQueue(Number(page), Number(limit));
    }
    async verifyPayment(id, req, dto) {
        return this.transactionService.adminVerify(id, req.user.id, dto.amountMatched, dto.referenceMatched, dto.adminNotes);
    }
};
exports.AdminPaymentQueueController = AdminPaymentQueueController;
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPaymentQueueController.prototype, "getPaymentQueue", null);
__decorate([
    (0, common_1.Patch)('transactions/:id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPaymentQueueController.prototype, "verifyPayment", null);
exports.AdminPaymentQueueController = AdminPaymentQueueController = __decorate([
    (0, common_1.Controller)('admin/queue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], AdminPaymentQueueController);
//# sourceMappingURL=payment-queue.controller.js.map