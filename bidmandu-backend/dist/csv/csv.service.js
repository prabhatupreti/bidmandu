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
exports.CsvService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const settlement_batch_entity_1 = require("../settlement/entities/settlement-batch.entity");
const transaction_entity_1 = require("../transaction/entities/transaction.entity");
const fs = require("fs");
const path = require("path");
let CsvService = class CsvService {
    constructor(batchRepo, txnRepo) {
        this.batchRepo = batchRepo;
        this.txnRepo = txnRepo;
    }
    async generateSettlementCsv(batchId) {
        const batch = await this.batchRepo.findOne({ where: { id: batchId } });
        if (!batch)
            throw new Error('Batch not found');
        const txns = await this.txnRepo.find({ where: { settlement_batch_id: batchId }, relations: ['seller'] });
        const header = 'Seller Name,Bank Account,IFSC,Amount,Reference\n';
        const rows = txns.map(txn => {
            const seller = txn.seller;
            const name = seller.email;
            const bankAccount = 'N/A';
            const ifsc = 'N/A';
            return `${name},${bankAccount},${ifsc},${txn.payout_amount},${txn.payment_ref_code}`;
        }).join('\n');
        const csvContent = header + rows;
        const fileName = `settlement_batch_${batchId}.csv`;
        const filePath = path.join(process.cwd(), 'exports', fileName);
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }
        fs.writeFileSync(filePath, csvContent, 'utf-8');
        batch.csv_file_url = filePath;
        await this.batchRepo.save(batch);
        return filePath;
    }
};
exports.CsvService = CsvService;
exports.CsvService = CsvService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(settlement_batch_entity_1.SettlementBatch)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CsvService);
//# sourceMappingURL=csv.service.js.map