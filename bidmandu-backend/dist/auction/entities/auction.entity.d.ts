import { Product } from '../../product/entities/product.entity';
export declare class Auction {
    id: string;
    product: Product;
    product_id: string;
    current_price: number;
    start_time: Date;
    end_time: Date;
    soft_close_window: number;
    extension_count: number;
    status: string;
    winner_id: string | null;
}
