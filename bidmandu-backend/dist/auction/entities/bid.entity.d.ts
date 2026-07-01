import { Auction } from './auction.entity';
import { User } from '../../user/entities/user.entity';
export declare class Bid {
    id: string;
    auction: Auction;
    auction_id: string;
    user: User;
    user_id: string;
    amount: number;
    created_at: Date;
}
