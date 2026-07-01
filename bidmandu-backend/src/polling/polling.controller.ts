import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ETagInterceptor } from './etag.interceptor';
import { AuctionService } from '../auction/auction.service';

@Controller('auctions')
export class PollingController {
  constructor(private auctionService: AuctionService) {}

  @Get(':id/state')
  @UseInterceptors(ETagInterceptor)
  getAuctionState(@Param('id') id: string) {
    return this.auctionService.getAuctionState(id);
  }

  // NEW: list active auctions
  @Get('list')
  getActiveAuctions() {
    return this.auctionService.getActiveAuctions();
  }
}