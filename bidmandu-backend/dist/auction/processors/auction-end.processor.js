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
exports.AuctionEndProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auction_entity_1 = require("../entities/auction.entity");
const redis_service_1 = require("../../redis/redis.service");
const transaction_service_1 = require("../../transaction/transaction.service");
let AuctionEndProcessor = class AuctionEndProcessor {
    constructor(auctionRepo, redisService, transactionService) {
        this.auctionRepo = auctionRepo;
        this.redisService = redisService;
        this.transactionService = transactionService;
    }
    async handleEndAuction(job) {
        const { auctionId } = job.data;
        const auction = await this.auctionRepo.findOne({ where: { id: auctionId }, relations: ['product', 'product.seller'] });
        if (!auction || auction.status !== 'ACTIVE')
            return;
        const winnerId = await this.redisService.get(`auction:${auctionId}:winner`);
        const finalPrice = await this.redisService.get(`auction:${auctionId}:price`);
        auction.status = 'COMPLETED';
        auction.winner_id = winnerId || null;
        auction.current_price = parseFloat(finalPrice || '0');
        await this.auctionRepo.save(auction);
        if (winnerId) {
            await this.transactionService.createTransaction(auctionId, winnerId, auction.product.seller_id, parseFloat(finalPrice || '0'));
        }
    }
};
exports.AuctionEndProcessor = AuctionEndProcessor;
__decorate([
    (0, bull_1.Process)('end-auction'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], AuctionEndProcessor.prototype, "handleEndAuction", null);
exports.AuctionEndProcessor = AuctionEndProcessor = __decorate([
    (0, bull_1.Processor)('auction-end'),
    __param(0, (0, typeorm_1.InjectRepository)(auction_entity_1.Auction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        redis_service_1.RedisService,
        transaction_service_1.TransactionService])
], AuctionEndProcessor);
//# sourceMappingURL=auction-end.processor.js.map