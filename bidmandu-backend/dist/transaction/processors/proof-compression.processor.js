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
exports.ProofCompressionProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../entities/transaction.entity");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const common_1 = require("@nestjs/common");
let ProofCompressionProcessor = class ProofCompressionProcessor {
    constructor(txnRepo, storage) {
        this.txnRepo = txnRepo;
        this.storage = storage;
    }
    async handleCompression(job) {
        const { txnId, originalUrl } = job.data;
        try {
            const inputPath = path.join(process.cwd(), 'uploads', originalUrl);
            const thumbDir = path.join(process.cwd(), 'uploads', 'proofs', txnId, 'thumb');
            if (!fs.existsSync(thumbDir))
                fs.mkdirSync(thumbDir, { recursive: true });
            const outputPath = path.join(thumbDir, 'thumb.jpg');
            await sharp(inputPath)
                .resize(600)
                .jpeg({ quality: 80 })
                .toFile(outputPath);
            const thumbUrl = `/proofs/${txnId}/thumb/thumb.jpg`;
            const txn = await this.txnRepo.findOne({ where: { id: txnId } });
            if (txn) {
                txn.proof_thumb_url = thumbUrl;
                await this.txnRepo.save(txn);
            }
        }
        catch (err) {
            console.error('Compression error', err);
        }
    }
};
exports.ProofCompressionProcessor = ProofCompressionProcessor;
__decorate([
    (0, bull_1.Process)('compress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProofCompressionProcessor.prototype, "handleCompression", null);
exports.ProofCompressionProcessor = ProofCompressionProcessor = __decorate([
    (0, bull_1.Processor)('proof-compression'),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, common_1.Inject)('IStorageService')),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], ProofCompressionProcessor);
//# sourceMappingURL=proof-compression.processor.js.map