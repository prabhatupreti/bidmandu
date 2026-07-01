import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { DisputeService } from '../../dispute/dispute.service';

@Controller('admin/disputes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDisputeController {
  constructor(private disputeService: DisputeService) {}

  @Get()
  getDisputes() {
    return this.disputeService.getDisputedTransactions();
  }

  @Patch(':id/force-confirm')
  forceConfirm(@Param('id') id: string, @Req() req) {
    return this.disputeService.adminForceConfirm(id, req.user.id);
  }

  @Patch(':id/reset-proof')
  resetProof(@Param('id') id: string) {
    return this.disputeService.adminResetProof(id);
  }
}