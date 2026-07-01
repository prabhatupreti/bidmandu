import { AuctionService } from '../auction/auction.service';
export declare class PollingController {
    private auctionService;
    constructor(auctionService: AuctionService);
    getAuctionState(id: string): Promise<{
        currentPrice: string;
        winnerId: string;
        endTime: Date | null;
        version: string;
    }>;
    getActiveAuctions(): Promise<{
        totalBids: number;
        id: string;
        product: import("../product/entities/product.entity").Product;
        product_id: string;
        current_price: number;
        start_time: Date;
        end_time: Date;
        soft_close_window: number;
        extension_count: number;
        status: string;
        winner_id: string | null;
    }[]>;
}
