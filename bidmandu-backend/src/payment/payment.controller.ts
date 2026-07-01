import { Controller, Get, Post, Param, UseGuards, UseInterceptors, UploadedFile, Req, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TransactionService } from '../transaction/transaction.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from '../system-config/entities/system-config.entity';

@Controller('transactions')
export class PaymentController {
  constructor(
    private transactionService: TransactionService,
    @InjectRepository(SystemConfig)
    private systemConfigRepo: Repository<SystemConfig>,
  ) {}

  @Get(':id/payment-details')
  @UseGuards(JwtAuthGuard)
  async getPaymentDetails(@Param('id') id: string) {
    const txn = await this.transactionService.findById(id);
    const config = await this.systemConfigRepo.findOne({ where: { key: 'STATIC_QR_URL' } });
    return {
      staticQrUrl: config?.value || '/assets/qr.jpg',
      accountName: 'Bidmandu Escrow',
      amountDue: txn.amount,
      paymentRef: txn.payment_ref_code,
      instructions: 'Scan the QR using any UPI/Bank app and enter the reference in remarks.',
    };
  }

  @Post(':id/proof')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('proof', { storage: memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadProof(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.transactionService.uploadProof(id, req.user.id, file);
  }

  @Post(':id/confirm-receipt')
  @UseGuards(JwtAuthGuard)
  async confirmReceipt(@Param('id') id: string, @Req() req) {
    return this.transactionService.confirmReceipt(id, req.user.id);
  }

  @Post(':id/ship')
  @UseGuards(JwtAuthGuard)
  async markShipped(
    @Param('id') id: string,
    @Body('tracking') tracking: string,
    @Req() req,
  ) {
    return this.transactionService.markShipped(id, req.user.id, tracking);
  }

  // NEW: get current user's transactions
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyTransactions(@Req() req) {
    return this.transactionService.getMyTransactions(req.user.id);
  }
}