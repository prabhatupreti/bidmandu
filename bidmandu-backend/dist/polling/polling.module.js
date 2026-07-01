"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollingModule = void 0;
const common_1 = require("@nestjs/common");
const polling_controller_1 = require("./polling.controller");
const etag_interceptor_1 = require("./etag.interceptor");
const auction_module_1 = require("../auction/auction.module");
const redis_service_1 = require("../redis/redis.service");
let PollingModule = class PollingModule {
};
exports.PollingModule = PollingModule;
exports.PollingModule = PollingModule = __decorate([
    (0, common_1.Module)({
        imports: [auction_module_1.AuctionModule],
        controllers: [polling_controller_1.PollingController],
        providers: [etag_interceptor_1.ETagInterceptor, redis_service_1.RedisService],
    })
], PollingModule);
//# sourceMappingURL=polling.module.js.map