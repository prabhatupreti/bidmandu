import { ProductService } from '../../product/product.service';
import { ReviewProductDto } from '../../product/dto/review-product.dto';
export declare class AdminProductQueueController {
    private productService;
    constructor(productService: ProductService);
    getPendingProducts(page?: number, limit?: number): Promise<{
        items: import("../../product/entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    reviewProduct(id: string, req: any, dto: ReviewProductDto): Promise<import("../../product/entities/product.entity").Product>;
}
