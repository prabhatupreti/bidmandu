import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerVerification } from './entities/seller-verification.entity';
import { SellerVerificationService } from './seller-verification.service';
import { SellerVerificationController } from './seller-verification.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SellerVerification]), UserModule],
  providers: [SellerVerificationService],
  controllers: [SellerVerificationController],
  exports: [SellerVerificationService],
})
export class SellerVerificationModule {}