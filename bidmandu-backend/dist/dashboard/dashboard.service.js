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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const product_entity_1 = require("../product/entities/product.entity");
const auction_entity_1 = require("../auction/entities/auction.entity");
const transaction_entity_1 = require("../transaction/entities/transaction.entity");
let DashboardService = class DashboardService {
    constructor(userRepo, productRepo, auctionRepo, txnRepo) {
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.auctionRepo = auctionRepo;
        this.txnRepo = txnRepo;
    }
    async getStats() {
        const totalUsers = await this.userRepo.count();
        const totalSellers = await this.userRepo.count({ where: { is_seller: true } });
        const totalProducts = await this.productRepo.count();
        const activeAuctions = await this.auctionRepo.count({ where: { status: 'ACTIVE' } });
        const completedTransactions = await this.txnRepo.count({ where: { status: 'SETTLED' } });
        const settledTxns = await this.txnRepo.find({ where: { status: 'SETTLED' } });
        const revenue = settledTxns.reduce((sum, txn) => sum + (txn.amount - (txn.payout_amount || 0)), 0);
        return {
            totalUsers,
            totalSellers,
            totalProducts,
            activeAuctions,
            completedTransactions,
            totalRevenue: revenue,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(auction_entity_1.Auction)),
    __param(3, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map