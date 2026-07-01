import { User } from '../../user/entities/user.entity';
export declare class Product {
    id: string;
    seller: User;
    seller_id: string;
    title: string;
    description: string;
    category: string;
    condition: string;
    starting_price: number;
    image_urls: string[];
    admin_approval_status: string;
    admin_approved_at: Date;
    admin_notes: string | null;
    created_at: Date;
}
