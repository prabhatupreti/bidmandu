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
exports.SellerVerificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const seller_verification_entity_1 = require("./entities/seller-verification.entity");
const user_service_1 = require("../user/user.service");
let SellerVerificationService = class SellerVerificationService {
    constructor(verificationRepo, userService, storage) {
        this.verificationRepo = verificationRepo;
        this.userService = userService;
        this.storage = storage;
    }
    async applyKyc(userId, panNumber, files) {
        if (!files.pan_image || !files.live_selfie) {
            throw new common_1.BadRequestException('Pan image and live selfie are required');
        }
        const panImageUrl = await this.storage.upload(files.pan_image, 'kyc/pan');
        const liveSelfieUrl = await this.storage.upload(files.live_selfie, 'kyc/selfie');
        let addressProofUrl;
        if (files.address_proof) {
            addressProofUrl = await this.storage.upload(files.address_proof, 'kyc/address');
        }
        const verification = this.verificationRepo.create({
            user_id: userId,
            pan_number: panNumber,
            pan_image_url: panImageUrl,
            live_selfie_url: liveSelfieUrl,
            address_proof_url: addressProofUrl,
            status: 'PENDING',
        });
        return this.verificationRepo.save(verification);
    }
    async getPendingVerifications(page = 1, limit = 20) {
        const [items, total] = await this.verificationRepo.findAndCount({
            where: { status: 'PENDING' },
            relations: ['user'],
            skip: (page - 1) * limit,
            take: limit,
            order: { created_at: 'ASC' },
        });
        return {
            items: items.map(v => ({
                id: v.id,
                user_id: v.user_id,
                user_email: v.user.email,
                pan_number: v.pan_number,
                pan_image_url: this.storage.getUrl(v.pan_image_url),
                live_selfie_url: this.storage.getUrl(v.live_selfie_url),
                address_proof_url: v.address_proof_url ? this.storage.getUrl(v.address_proof_url) : null,
                status: v.status,
                created_at: v.created_at,
            })),
            total,
            page,
            limit,
        };
    }
    async reviewKyc(verificationId, adminId, decision, adminNotes) {
        const verification = await this.verificationRepo.findOne({ where: { id: verificationId } });
        if (!verification)
            throw new common_1.NotFoundException('Verification not found');
        if (verification.status !== 'PENDING')
            throw new common_1.BadRequestException('Already reviewed');
        verification.status = decision;
        verification.admin_id = adminId;
        verification.admin_notes = adminNotes || undefined;
        await this.verificationRepo.save(verification);
        if (decision === 'APPROVED') {
            await this.userService.setSellerStatus(verification.user_id, true);
        }
        return verification;
    }
};
exports.SellerVerificationService = SellerVerificationService;
exports.SellerVerificationService = SellerVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(seller_verification_entity_1.SellerVerification)),
    __param(2, (0, common_1.Inject)('IStorageService')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService, Object])
], SellerVerificationService);
//# sourceMappingURL=seller-verification.service.js.map