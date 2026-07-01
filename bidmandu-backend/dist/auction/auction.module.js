"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const auction_entity_1 = require("./entities/auction.entity");
const bid_entity_1 = require("./entities/bid.entity");
const auction_service_1 = require("./auction.service");
const auction_controller_1 = require("./auction.controller");
const auction_actions_controller_1 = require("./auction-actions.controller");
const auction_end_processor_1 = require("./processors/auction-end.processor");
const redis_service_1 = require("../redis/redis.service");
const transaction_module_1 = require("../transaction/transaction.module");
let AuctionModule = class AuctionModule {
};
exports.AuctionModule = AuctionModule;
exports.AuctionModule = AuctionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([auction_entity_1.Auction, bid_entity_1.Bid]),
            bull_1.BullModule.registerQueue({ name: 'auction-end' }),
            transaction_module_1.TransactionModule,
        ],
        providers: [auction_service_1.AuctionService, redis_service_1.RedisService, auction_end_processor_1.AuctionEndProcessor],
        controllers: [auction_controller_1.AuctionController, auction_actions_controller_1.AuctionActionsController],
        exports: [auction_service_1.AuctionService],
    })
], AuctionModule);
//# sourceMappingURL=auction.module.js.map