"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const kyc_queue_controller_1 = require("./controllers/kyc-queue.controller");
const product_queue_controller_1 = require("./controllers/product-queue.controller");
const payment_queue_controller_1 = require("./controllers/payment-queue.controller");
const settlement_controller_1 = require("./controllers/settlement.controller");
const dispute_controller_1 = require("./controllers/dispute.controller");
const seller_verification_module_1 = require("../seller-verification/seller-verification.module");
const product_module_1 = require("../product/product.module");
const transaction_module_1 = require("../transaction/transaction.module");
const settlement_module_1 = require("../settlement/settlement.module");
const dispute_module_1 = require("../dispute/dispute.module");
const csv_module_1 = require("../csv/csv.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            seller_verification_module_1.SellerVerificationModule,
            product_module_1.ProductModule,
            transaction_module_1.TransactionModule,
            settlement_module_1.SettlementModule,
            dispute_module_1.DisputeModule,
            csv_module_1.CsvModule,
        ],
        controllers: [
            kyc_queue_controller_1.KycQueueController,
            product_queue_controller_1.AdminProductQueueController,
            payment_queue_controller_1.AdminPaymentQueueController,
            settlement_controller_1.AdminSettlementController,
            dispute_controller_1.AdminDisputeController,
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map