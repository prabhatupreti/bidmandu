import { Controller, Get, Patch, Param, Query, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TransactionService } from '../../transaction/transaction.service';

@Controller('admin/queue')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminPaymentQueueController {
  constructor(private transactionService: TransactionService) {}

  @Get('payments')
  async getPaymentQueue(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.transactionService.getPaymentQueue(Number(page), Number(limit));
  }

  @Patch('transactions/:id/verify')
  async verifyPayment(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: { amountMatched: boolean; referenceMatched: boolean; adminNotes: string },
  ) {
    return this.transactionService.adminVerify(id, req.user.id, dto.amountMatched, dto.referenceMatched, dto.adminNotes);
  }
}