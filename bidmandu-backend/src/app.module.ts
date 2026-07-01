import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SellerVerificationModule } from './seller-verification/seller-verification.module';
import { StorageModule } from './storage/storage.module';
import { AdminModule } from './admin/admin.module';
import { ProductModule } from './product/product.module';
import { AuctionModule } from './auction/auction.module';
import { PollingModule } from './polling/polling.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaymentModule } from './payment/payment.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { SettlementModule } from './settlement/settlement.module';
import { TasksModule } from './tasks/tasks.module';
import { NotificationModule } from './notification/notification.module';
import { DisputeModule } from './dispute/dispute.module';
import { CsvModule } from './csv/csv.module';
import { DashboardModule } from './dashboard/dashboard.module';
import configuration from './config/configuration';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbPassword = config.get<string>('database.password');
        return {
          type: 'postgres',
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.username'),
          password: dbPassword || undefined,
          database: config.get<string>('database.name'),
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true,
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
        },
      }),
    }),
    AuthModule,
    UserModule,
    SellerVerificationModule,
    StorageModule,
    AdminModule,
    ProductModule,
    AuctionModule,
    PollingModule,
    TransactionModule,
    PaymentModule,
    SystemConfigModule,
    SettlementModule,
    TasksModule,
    NotificationModule,
    DisputeModule,
    CsvModule,
    DashboardModule,
  ],
})
export class AppModule {}