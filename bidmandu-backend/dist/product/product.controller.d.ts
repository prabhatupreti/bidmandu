import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    createProduct(images: Express.Multer.File[], dto: CreateProductDto, req: any): Promise<import("./entities/product.entity").Product>;
    submitForApproval(id: string, req: any): Promise<import("./entities/product.entity").Product>;
    getMyProducts(req: any): Promise<any[]>;
}
