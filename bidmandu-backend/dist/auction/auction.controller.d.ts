import { AuctionService } from './auction.service';
import { PlaceBidDto } from './dto/bid.dto';
export declare class AuctionController {
    private auctionService;
    constructor(auctionService: AuctionService);
    placeBid(dto: PlaceBidDto, req: any): Promise<{
        success: boolean;
        newPrice: number;
    }>;
}
