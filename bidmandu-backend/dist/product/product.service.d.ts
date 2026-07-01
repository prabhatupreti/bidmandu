import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ReviewProductDto } from './dto/review-product.dto';
import { AuctionService } from '../auction/auction.service';
import { Auction } from '../auction/entities/auction.entity';
import { Bid } from '../auction/entities/bid.entity';
import { IStorageService } from '../storage/storage.interface';
export declare class ProductService {
    private productRepo;
    private auctionRepo;
    private bidRepo;
    private auctionService;
    private storage;
    constructor(productRepo: Repository<Product>, auctionRepo: Repository<Auction>, bidRepo: Repository<Bid>, auctionService: AuctionService, storage: IStorageService);
    create(userId: string, dto: CreateProductDto, images?: Express.Multer.File[]): Promise<Product>;
    submitForApproval(productId: string, userId: string): Promise<Product>;
    getPendingProducts(page?: number, limit?: number): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    reviewProduct(productId: string, adminId: string, dto: ReviewProductDto): Promise<Product>;
    getMyProducts(userId: string): Promise<any[]>;
}
