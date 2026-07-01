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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementBatch = void 0;
const typeorm_1 = require("typeorm");
let SettlementBatch = class SettlementBatch {
};
exports.SettlementBatch = SettlementBatch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SettlementBatch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SettlementBatch.prototype, "admin_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'OPEN' }),
    __metadata("design:type", String)
], SettlementBatch.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SettlementBatch.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SettlementBatch.prototype, "total_fee", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SettlementBatch.prototype, "csv_file_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SettlementBatch.prototype, "created_at", void 0);
exports.SettlementBatch = SettlementBatch = __decorate([
    (0, typeorm_1.Entity)('settlement_batches')
], SettlementBatch);
//# sourceMappingURL=settlement-batch.entity.js.map