import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ReviewProductDto } from './dto/review-product.dto';
import { AuctionService } from '../auction/auction.service';
import { Auction } from '../auction/entities/auction.entity';
import { Bid } from '../auction/entities/bid.entity';
import { IStorageService } from '../storage/storage.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Auction)
    private auctionRepo: Repository<Auction>,
    @InjectRepository(Bid)
    private bidRepo: Repository<Bid>,
    private auctionService: AuctionService,
    @Inject('IStorageService') private storage: IStorageService,
  ) {}

  async create(userId: string, dto: CreateProductDto, images?: Express.Multer.File[]) {
    const imageUrls: string[] = [];
    if (images && images.length > 0) {
      for (const img of images) {
        const url = await this.storage.upload(img, 'products');
        imageUrls.push(url);
      }
    }
    const product = this.productRepo.create({
      seller_id: userId,
      title: dto.title,
      description: dto.description,
      category: dto.category || 'Other',
      condition: dto.condition || 'Gently Used',   // NEW
      starting_price: dto.starting_price,
      image_urls: imageUrls,
      admin_approval_status: 'DRAFT',
    });
    return this.productRepo.save(product);
  }

  async submitForApproval(productId: string, userId: string) {
    const product = await this.productRepo.findOne({ where: { id: productId, seller_id: userId } });
    if (!product) throw new NotFoundException('Product not found');
    product.admin_approval_status = 'PENDING';
    return this.productRepo.save(product);
  }

  async getPendingProducts(page = 1, limit = 20) {
    const [items, total] = await this.productRepo.findAndCount({
      where: { admin_approval_status: 'PENDING' },
      relations: ['seller'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'ASC' },
    });
    return { items, total, page, limit };
  }

  async reviewProduct(productId: string, adminId: string, dto: ReviewProductDto) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    product.admin_approval_status = dto.decision;
    product.admin_notes = dto.admin_notes ?? null;
    if (dto.decision === 'APPROVED') {
      product.admin_approved_at = new Date();
      await this.productRepo.save(product);
      await this.auctionService.createAuction(product);
    } else {
      await this.productRepo.save(product);
    }
    return product;
  }

  async getMyProducts(userId: string) {
    const products = await this.productRepo.find({
      where: { seller_id: userId },
      relations: ['seller'],
      order: { created_at: 'DESC' },
    });

    const result: any[] = [];
    for (const product of products) {
      const auction = await this.auctionRepo.findOne({
        where: { product_id: product.id },
        relations: ['product'],
      });
      if (!auction) continue;

      const bids = await this.bidRepo.find({
        where: { auction_id: auction.id },
        order: { created_at: 'ASC' },
      });

      const anonymisedBids = bids.map((bid, index) => ({
        id: bid.id,
        bidder_alias: `Bidder ${index + 1}`,
        amount: bid.amount,
        created_at: bid.created_at,
      }));

      result.push({
        product: {
          id: product.id,
          title: product.title,
          description: product.description,
          category: product.category,
          condition: product.condition,          // NEW
          image_urls: product.image_urls,
          starting_price: product.starting_price,
          admin_approval_status: product.admin_approval_status,
        },
        auction: {
          id: auction.id,
          current_price: auction.current_price,
          start_time: auction.start_time,
          end_time: auction.end_time,
          status: auction.status,
          winner_id: auction.winner_id,
          extension_count: auction.extension_count,
        },
        bids: anonymisedBids,
        totalBids: bids.length,
      });
    }

    return result;
  }
}