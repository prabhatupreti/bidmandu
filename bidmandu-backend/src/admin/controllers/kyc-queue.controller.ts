import {
  Controller, Get, Patch, Param, Query, UseGuards, Req, Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SellerVerificationService } from '../../seller-verification/seller-verification.service';
import { KycReviewDto } from '../../seller-verification/dto/kyc-review.dto';

@Controller('admin/kyc')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class KycQueueController {
  constructor(private verificationService: SellerVerificationService) {}

  @Get('queue')
  getKycQueue(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.verificationService.getPendingVerifications(Number(page), Number(limit));
  }

  @Patch(':id/approve')
  approveKyc(@Param('id') id: string, @Req() req, @Body() reviewDto: KycReviewDto) {
    return this.verificationService.reviewKyc(id, req.user.id, 'APPROVED', reviewDto.admin_notes);
  }

  @Patch(':id/reject')
  rejectKyc(@Param('id') id: string, @Req() req, @Body() reviewDto: KycReviewDto) {
    return this.verificationService.reviewKyc(id, req.user.id, 'REJECTED', reviewDto.admin_notes);
  }
}