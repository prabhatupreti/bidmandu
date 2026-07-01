import { User } from '../../user/entities/user.entity';
export declare class SellerVerification {
    id: string;
    user: User;
    user_id: string;
    pan_number: string;
    pan_image_url: string;
    live_selfie_url: string;
    address_proof_url?: string;
    status: string;
    admin_notes?: string;
    admin_id?: string;
    created_at: Date;
}
