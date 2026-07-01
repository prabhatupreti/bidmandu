"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerVerificationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seller_verification_entity_1 = require("./entities/seller-verification.entity");
const seller_verification_service_1 = require("./seller-verification.service");
const seller_verification_controller_1 = require("./seller-verification.controller");
const user_module_1 = require("../user/user.module");
let SellerVerificationModule = class SellerVerificationModule {
};
exports.SellerVerificationModule = SellerVerificationModule;
exports.SellerVerificationModule = SellerVerificationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([seller_verification_entity_1.SellerVerification]), user_module_1.UserModule],
        providers: [seller_verification_service_1.SellerVerificationService],
        controllers: [seller_verification_controller_1.SellerVerificationController],
        exports: [seller_verification_service_1.SellerVerificationService],
    })
], SellerVerificationModule);
//# sourceMappingURL=seller-verification.module.js.map