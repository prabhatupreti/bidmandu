import { Controller, Get, Post, Param, Body, UseGuards, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SettlementService } from '../../settlement/settlement.service';
import { TransactionService } from '../../transaction/transaction.service';
import { CsvService } from '../../csv/csv.service';

@Controller('admin/settlements')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminSettlementController {
  constructor(
    private settlementService: SettlementService,
    private transactionService: TransactionService,
    private csvService: CsvService,
  ) {}

  @Get('ready')
  getReadyForSettlement() {
    return this.transactionService.getTransactionsReadyForSettlement();
  }

  @Post('batch')
  settleBatch(@Req() req, @Body() dto: { transactionIds: string[] }) {
    return this.settlementService.settleTransactions(req.user.id, dto.transactionIds);
  }

  @Get('batch/:id/csv')
  async getSettlementCsv(@Param('id') id: string, @Res() res: Response) {
    const filePath = await this.csvService.generateSettlementCsv(id);
    res.download(filePath);
  }
}