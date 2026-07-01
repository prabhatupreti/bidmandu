"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const seller_verification_module_1 = require("./seller-verification/seller-verification.module");
const storage_module_1 = require("./storage/storage.module");
const admin_module_1 = require("./admin/admin.module");
const product_module_1 = require("./product/product.module");
const auction_module_1 = require("./auction/auction.module");
const polling_module_1 = require("./polling/polling.module");
const transaction_module_1 = require("./transaction/transaction.module");
const payment_module_1 = require("./payment/payment.module");
const system_config_module_1 = require("./system-config/system-config.module");
const settlement_module_1 = require("./settlement/settlement.module");
const tasks_module_1 = require("./tasks/tasks.module");
const notification_module_1 = require("./notification/notification.module");
const dispute_module_1 = require("./dispute/dispute.module");
const csv_module_1 = require("./csv/csv.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const configuration_1 = require("./config/configuration");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const dbPassword = config.get('database.password');
                    return {
                        type: 'postgres',
                        host: config.get('database.host'),
                        port: config.get('database.port'),
                        username: config.get('database.username'),
                        password: dbPassword || undefined,
                        database: config.get('database.name'),
                        entities: [(0, path_1.join)(__dirname, '**', '*.entity.{ts,js}')],
                        synchronize: true,
                    };
                },
            }),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    redis: {
                        host: config.get('redis.host'),
                        port: config.get('redis.port'),
                    },
                }),
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            seller_verification_module_1.SellerVerificationModule,
            storage_module_1.StorageModule,
            admin_module_1.AdminModule,
            product_module_1.ProductModule,
            auction_module_1.AuctionModule,
            polling_module_1.PollingModule,
            transaction_module_1.TransactionModule,
            payment_module_1.PaymentModule,
            system_config_module_1.SystemConfigModule,
            settlement_module_1.SettlementModule,
            tasks_module_1.TasksModule,
            notification_module_1.NotificationModule,
            dispute_module_1.DisputeModule,
            csv_module_1.CsvModule,
            dashboard_module_1.DashboardModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map