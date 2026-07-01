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
exports.AdminSettlementController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const settlement_service_1 = require("../../settlement/settlement.service");
const transaction_service_1 = require("../../transaction/transaction.service");
const csv_service_1 = require("../../csv/csv.service");
let AdminSettlementController = class AdminSettlementController {
    constructor(settlementService, transactionService, csvService) {
        this.settlementService = settlementService;
        this.transactionService = transactionService;
        this.csvService = csvService;
    }
    getReadyForSettlement() {
        return this.transactionService.getTransactionsReadyForSettlement();
    }
    settleBatch(req, dto) {
        return this.settlementService.settleTransactions(req.user.id, dto.transactionIds);
    }
    async getSettlementCsv(id, res) {
        const filePath = await this.csvService.generateSettlementCsv(id);
        res.download(filePath);
    }
};
exports.AdminSettlementController = AdminSettlementController;
__decorate([
    (0, common_1.Get)('ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminSettlementController.prototype, "getReadyForSettlement", null);
__decorate([
    (0, common_1.Post)('batch'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminSettlementController.prototype, "settleBatch", null);
__decorate([
    (0, common_1.Get)('batch/:id/csv'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminSettlementController.prototype, "getSettlementCsv", null);
exports.AdminSettlementController = AdminSettlementController = __decorate([
    (0, common_1.Controller)('admin/settlements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [settlement_service_1.SettlementService,
        transaction_service_1.TransactionService,
        csv_service_1.CsvService])
], AdminSettlementController);
//# sourceMappingURL=settlement.controller.js.map