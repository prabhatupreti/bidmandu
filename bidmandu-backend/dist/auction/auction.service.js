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
exports.AuctionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const auction_entity_1 = require("./entities/auction.entity");
const bid_entity_1 = require("./entities/bid.entity");
const redis_service_1 = require("../redis/redis.service");
const transaction_service_1 = require("../transaction/transaction.service");
const BID_LUA_SCRIPT = `
local current_price = redis.call('GET', KEYS[1])
if not current_price then
  return { err = "AUCTION_NOT_FOUND" }
end
current_price = tonumber(current_price)
if tonumber(ARGV[1]) < current_price + tonumber(ARGV[3]) then
  return { err = "BID_TOO_LOW" }
end
redis.call('SET', KEYS[1], ARGV[1])
redis.call('SET', KEYS[2], ARGV[2])
redis.call('INCR', KEYS[3])
return { ok = current_price + tonumber(ARGV[3]) }
`;
let AuctionService = class AuctionService {
    constructor(auctionRepo, bidRepo, redisService, auctionEndQueue, transactionService) {
        this.auctionRepo = auctionRepo;
        this.bidRepo = bidRepo;
        this.redisService = redisService;
        this.auctionEndQueue = auctionEndQueue;
        this.transactionService = transactionService;
    }
    async createAuction(product) {
        const durationDays = 7;
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + durationDays * 24 * 60 * 60 * 1000);
        const auction = this.auctionRepo.create({
            product_id: product.id,
            current_price: product.starting_price,
            start_time: startTime,
            end_time: endTime,
            status: 'ACTIVE',
        });
        const saved = await this.auctionRepo.save(auction);
        await this.redisService.set(`auction:${saved.id}:price`, product.starting_price.toString());
        await this.redisService.set(`auction:${saved.id}:winner`, '');
        await this.redisService.set(`auction:${saved.id}:version`, '0');
        const delay = endTime.getTime() - Date.now();
        await this.auctionEndQueue.add('end-auction', { auctionId: saved.id }, { delay, jobId: `auction-end-${saved.id}` });
        return saved;
    }
    async placeBid(userId, auctionId, amount) {
        const auction = await this.auctionRepo.findOne({ where: { id: auctionId } });
        if (!auction || auction.status !== 'ACTIVE')
            throw new common_1.NotFoundException('Auction not active');
        const rateKey = `rate:${userId}:bids`;
        const attempts = await this.redisService.client.incr(rateKey);
        if (attempts === 1)
            await this.redisService.client.expire(rateKey, 60);
        if (attempts > 10)
            throw new common_1.ConflictException('Too many bids, slow down');
        const minIncrement = 1;
        const keys = [
            `auction:${auctionId}:price`,
            `auction:${auctionId}:winner`,
            `auction:${auctionId}:version`,
        ];
        const args = [amount.toString(), userId, minIncrement.toString()];
        const result = (await this.redisService.eval(BID_LUA_SCRIPT, keys, args));
        if (result.err) {
            throw new common_1.ConflictException(result.err);
        }
        const now = Date.now();
        const softCloseMs = auction.soft_close_window * 1000;
        const auctionEndTime = new Date(auction.end_time).getTime();
        if (now >= auctionEndTime - softCloseMs) {
            const newEndTime = new Date(now + softCloseMs);
            auction.end_time = newEndTime;
            auction.extension_count += 1;
            await this.auctionRepo.save(auction);
            const existingJob = await this.auctionEndQueue.getJob(`auction-end-${auctionId}`);
            if (existingJob)
                await existingJob.remove();
            const delay = newEndTime.getTime() - Date.now();
            await this.auctionEndQueue.add('end-auction', { auctionId }, { delay, jobId: `auction-end-${auctionId}` });
        }
        this.bidRepo.save({
            auction_id: auctionId,
            user_id: userId,
            amount: amount,
        });
        return { success: true, newPrice: amount };
    }
    async getAuctionState(auctionId) {
        let price = await this.redisService.get(`auction:${auctionId}:price`);
        let winner = await this.redisService.get(`auction:${auctionId}:winner`);
        let version = await this.redisService.get(`auction:${auctionId}:version`);
        if (price === null) {
            const auction = await this.auctionRepo.findOne({ where: { id: auctionId } });
            if (auction) {
                price = auction.current_price.toString();
                winner = auction.winner_id || '';
                version = '0';
                await this.redisService.set(`auction:${auctionId}:price`, price);
                await this.redisService.set(`auction:${auctionId}:winner`, winner);
                await this.redisService.set(`auction:${auctionId}:version`, version);
            }
            else {
                throw new common_1.NotFoundException('Auction not found');
            }
        }
        const auction = await this.auctionRepo.findOne({ where: { id: auctionId } });
        return {
            currentPrice: price || '0',
            winnerId: winner || '',
            endTime: auction ? auction.end_time : null,
            version: version || '0',
        };
    }
    async getActiveAuctions(userId) {
        const query = this.auctionRepo
            .createQueryBuilder('auction')
            .leftJoinAndSelect('auction.product', 'product')
            .leftJoinAndSelect('product.seller', 'seller')
            .leftJoin('bids', 'bid', 'bid.auction_id = auction.id')
            .addSelect('COUNT(bid.id)', 'totalBids')
            .where('auction.status = :status', { status: 'ACTIVE' })
            .groupBy('auction.id, product.id, seller.id');
        if (userId) {
            query.andHaving('product.seller_id != :userId', { userId });
        }
        const raw = await query.orderBy('auction.end_time', 'ASC').getRawAndEntities();
        const result = raw.entities.map((entity, i) => ({
            ...entity,
            totalBids: parseInt(raw.raw[i]?.totalBids || '0', 10),
        }));
        return result;
    }
    async acceptBid(auctionId, sellerId, bidId) {
        const auction = await this.auctionRepo.findOne({
            where: { id: auctionId },
            relations: ['product', 'product.seller'],
        });
        if (!auction || auction.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Auction is not active');
        }
        if (auction.product.seller_id !== sellerId) {
            throw new common_1.BadRequestException('Only the product seller can accept bids');
        }
        const bid = await this.bidRepo.findOne({ where: { id: bidId, auction_id: auctionId } });
        if (!bid) {
            throw new common_1.NotFoundException('Bid not found');
        }
        if (bid.amount < auction.current_price) {
            throw new common_1.BadRequestException('Bid is lower than current price');
        }
        auction.status = 'COMPLETED';
        auction.winner_id = bid.user_id;
        auction.current_price = bid.amount;
        await this.auctionRepo.save(auction);
        const existingJob = await this.auctionEndQueue.getJob(`auction-end-${auctionId}`);
        if (existingJob)
            await existingJob.remove();
        const txn = await this.transactionService.createTransaction(auctionId, bid.user_id, auction.product.seller_id, bid.amount);
        return { auction, transaction: txn };
    }
};
exports.AuctionService = AuctionService;
exports.AuctionService = AuctionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auction_entity_1.Auction)),
    __param(1, (0, typeorm_1.InjectRepository)(bid_entity_1.Bid)),
    __param(3, (0, bull_1.InjectQueue)('auction-end')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        redis_service_1.RedisService, Object, transaction_service_1.TransactionService])
], AuctionService);
//# sourceMappingURL=auction.service.js.map