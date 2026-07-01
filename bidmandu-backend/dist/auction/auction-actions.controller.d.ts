import { AuctionService } from './auction.service';
export declare class AuctionActionsController {
    private auctionService;
    constructor(auctionService: AuctionService);
    acceptBid(auctionId: string, bidId: string, req: any): Promise<{
        auction: import("./entities/auction.entity").Auction;
        transaction: import("../transaction/entities/transaction.entity").Transaction;
    }>;
}
