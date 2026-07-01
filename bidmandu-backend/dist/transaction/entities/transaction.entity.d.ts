import { User } from '../../user/entities/user.entity';
import { Auction } from '../../auction/entities/auction.entity';
export declare class Transaction {
    id: string;
    auction: Auction;
    auction_id: string;
    buyer: User;
    buyer_id: string;
    seller: User;
    seller_id: string;
    amount: number;
    payment_ref_code: string;
    status: string;
    proof_image_url: string | null;
    proof_thumb_url: string | null;
    admin_verified_at: Date;
    admin_notes: string;
    shipping_details: string | null;
    buyer_confirmed_at: Date;
    settlement_batch_id: string;
    payout_amount: number;
    created_at: Date;
    updated_at: Date;
}
