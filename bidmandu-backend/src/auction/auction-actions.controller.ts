import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuctionService } from './auction.service';

@Controller('auctions')
export class AuctionActionsController {
  constructor(private auctionService: AuctionService) {}

  @Post(':id/accept-bid')
  @UseGuards(JwtAuthGuard)
  async acceptBid(
    @Param('id') auctionId: string,
    @Body('bidId') bidId: string,
    @Req() req,
  ) {
    return this.auctionService.acceptBid(auctionId, req.user.id, bidId);
  }
}