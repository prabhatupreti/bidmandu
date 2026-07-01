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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const auction_service_1 = require("../auction/auction.service");
const auction_entity_1 = require("../auction/entities/auction.entity");
const bid_entity_1 = require("../auction/entities/bid.entity");
let ProductService = class ProductService {
    constructor(productRepo, auctionRepo, bidRepo, auctionService, storage) {
        this.productRepo = productRepo;
        this.auctionRepo = auctionRepo;
        this.bidRepo = bidRepo;
        this.auctionService = auctionService;
        this.storage = storage;
    }
    async create(userId, dto, images) {
        const imageUrls = [];
        if (images && images.length > 0) {
            for (const img of images) {
                const url = await this.storage.upload(img, 'products');
                imageUrls.push(url);
            }
        }
        const product = this.productRepo.create({
            seller_id: userId,
            title: dto.title,
            description: dto.description,
            category: dto.category || 'Other',
            condition: dto.condition || 'Gently Used',
            starting_price: dto.starting_price,
            image_urls: imageUrls,
            admin_approval_status: 'DRAFT',
        });
        return this.productRepo.save(product);
    }
    async submitForApproval(productId, userId) {
        const product = await this.productRepo.findOne({ where: { id: productId, seller_id: userId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        product.admin_approval_status = 'PENDING';
        return this.productRepo.save(product);
    }
    async getPendingProducts(page = 1, limit = 20) {
        const [items, total] = await this.productRepo.findAndCount({
            where: { admin_approval_status: 'PENDING' },
            relations: ['seller'],
            skip: (page - 1) * limit,
            take: limit,
            order: { created_at: 'ASC' },
        });
        return { items, total, page, limit };
    }
    async reviewProduct(productId, adminId, dto) {
        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        product.admin_approval_status = dto.decision;
        product.admin_notes = dto.admin_notes ?? null;
        if (dto.decision === 'APPROVED') {
            product.admin_approved_at = new Date();
            await this.productRepo.save(product);
            await this.auctionService.createAuction(product);
        }
        else {
            await this.productRepo.save(product);
        }
        return product;
    }
    async getMyProducts(userId) {
        const products = await this.productRepo.find({
            where: { seller_id: userId },
            relations: ['seller'],
            order: { created_at: 'DESC' },
        });
        const result = [];
        for (const product of products) {
            const auction = await this.auctionRepo.findOne({
                where: { product_id: product.id },
                relations: ['product'],
            });
            if (!auction)
                continue;
            const bids = await this.bidRepo.find({
                where: { auction_id: auction.id },
                order: { created_at: 'ASC' },
            });
            const anonymisedBids = bids.map((bid, index) => ({
                id: bid.id,
                bidder_alias: `Bidder ${index + 1}`,
                amount: bid.amount,
                created_at: bid.created_at,
            }));
            result.push({
                product: {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    category: product.category,
                    condition: product.condition,
                    image_urls: product.image_urls,
                    starting_price: product.starting_price,
                    admin_approval_status: product.admin_approval_status,
                },
                auction: {
                    id: auction.id,
                    current_price: auction.current_price,
                    start_time: auction.start_time,
                    end_time: auction.end_time,
                    status: auction.status,
                    winner_id: auction.winner_id,
                    extension_count: auction.extension_count,
                },
                bids: anonymisedBids,
                totalBids: bids.length,
            });
        }
        return result;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(auction_entity_1.Auction)),
    __param(2, (0, typeorm_1.InjectRepository)(bid_entity_1.Bid)),
    __param(4, (0, common_1.Inject)('IStorageService')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auction_service_1.AuctionService, Object])
], ProductService);
//# sourceMappingURL=product.service.js.map