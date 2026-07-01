import { Controller, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuctionService } from './auction.service';
import { PlaceBidDto } from './dto/bid.dto';

@Controller('bids')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  placeBid(@Body() dto: PlaceBidDto, @Req() req) {
    return this.auctionService.placeBid(req.user.id, dto.auctionId, dto.amount);
  }

  // We will also add the accept-bid endpoint here under /bids prefix? No, it should be under auctions.
  // Instead, create a separate controller for auctions actions.
}