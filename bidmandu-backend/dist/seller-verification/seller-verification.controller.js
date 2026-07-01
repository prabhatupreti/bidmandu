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
exports.SellerVerificationController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const seller_verification_service_1 = require("./seller-verification.service");
const kyc_apply_dto_1 = require("./dto/kyc-apply.dto");
const multer_1 = require("multer");
let SellerVerificationController = class SellerVerificationController {
    constructor(verificationService) {
        this.verificationService = verificationService;
    }
    async applyKyc(files, kycApplyDto, req) {
        const panImage = files.pan_image?.[0];
        const liveSelfie = files.live_selfie?.[0];
        const addressProof = files.address_proof?.[0];
        return this.verificationService.applyKyc(req.user.id, kycApplyDto.pan_number, {
            pan_image: panImage,
            live_selfie: liveSelfie,
            address_proof: addressProof,
        });
    }
};
exports.SellerVerificationController = SellerVerificationController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'pan_image', maxCount: 1 },
        { name: 'live_selfie', maxCount: 1 },
        { name: 'address_proof', maxCount: 1 },
    ], {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, kyc_apply_dto_1.KycApplyDto, Object]),
    __metadata("design:returntype", Promise)
], SellerVerificationController.prototype, "applyKyc", null);
exports.SellerVerificationController = SellerVerificationController = __decorate([
    (0, common_1.Controller)('kyc'),
    __metadata("design:paramtypes", [seller_verification_service_1.SellerVerificationService])
], SellerVerificationController);
//# sourceMappingURL=seller-verification.controller.js.map