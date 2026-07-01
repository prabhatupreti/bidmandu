import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { Product } from '../product/entities/product.entity';
import { RedisService } from '../redis/redis.service';
import { TransactionService } from '../transaction/transaction.service';

const BID_LUA_SCRIPT = `
local current_price = redis.call('GET', KEYS[1])
if not current_price then
  return { err = "AUCTION_NOT_FOUND" }
end
current_price = tonumber(current_price)
if tonumber(ARGV[1]) < current_price + tonumber(ARGV[3]) then
  return { err = "BID_TOO_LOW" }
end
redis.call('SET', KEYS[1], ARGV[1])
redis.call('SET', KEYS[2], ARGV[2])
redis.call('INCR', KEYS[3])
return { ok = current_price + tonumber(ARGV[3]) }
`;

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction) private auctionRepo: Repository<Auction>,
    @InjectRepository(Bid) private bidRepo: Repository<Bid>,
    private redisService: RedisService,
    @InjectQueue('auction-end') private auctionEndQueue: Queue,
    private transactionService: TransactionService,
  ) {}

  async createAuction(product: Product) {
    const durationDays = 7;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const auction = this.auctionRepo.create({
      product_id: product.id,
      current_price: product.starting_price,
      start_time: startTime,
      end_time: endTime,
      status: 'ACTIVE',
    });
    const saved = await this.auctionRepo.save(auction);

    await this.redisService.set(`auction:${saved.id}:price`, product.starting_price.toString());
    await this.redisService.set(`auction:${saved.id}:winner`, '');
    await this.redisService.set(`auction:${saved.id}:version`, '0');

    const delay = endTime.getTime() - Date.now();
    await this.auctionEndQueue.add(
      'end-auction',
      { auctionId: saved.id },
      { delay, jobId: `auction-end-${saved.id}` },
    );

    return saved;
  }

  async placeBid(userId: string, auctionId: string, amount: number) {
    const auction = await this.auctionRepo.findOne({ where: { id: auctionId } });
    if (!auction || auction.status !== 'ACTIVE')
      throw new NotFoundException('Auction not active');

    const rateKey = `rate:${userId}:bids`;
    const attempts = await this.redisService.client.incr(rateKey);
    if (attempts === 1) await this.redisService.client.expire(rateKey, 60);
    if (attempts > 10) throw new ConflictException('Too many bids, slow down');

    const minIncrement = 1;
    const keys = [
      `auction:${auctionId}:price`,
      `auction:${auctionId}:winner`,
      `auction:${auctionId}:version`,
    ];
    const args = [amount.toString(), userId, minIncrement.toString()];

    const result = (await this.redisService.eval(BID_LUA_SCRIPT, keys, args)) as any;
    if (result.err) {
      throw new ConflictException(result.err);
    }

    const now = Date.now();
    const softCloseMs = auction.soft_close_window * 1000;
    const auctionEndTime = new Date(auction.end_time).getTime();
    if (now >= auctionEndTime - softCloseMs) {
      const newEndTime = new Date(now + softCloseMs);
      auction.end_time = newEndTime;
      auction.extension_count += 1;
      await this.auctionRepo.save(auction);

      const existingJob = await this.auctionEndQueue.getJob(`auction-end-${auctionId}`);
      if (existingJob) await existingJob.remove();
      const delay = newEndTime.getTime() - Date.now();
      await this.auctionEndQueue.add(
        'end-auction',
        { auctionId },
        { delay, jobId: `auction-end-${auctionId}` },
      );
    }

    this.bidRepo.save({
      auction_id: auctionId,
      user_id: userId,
      amount: amount,
    });

    return { success: true, newPrice: amount };
  }

  async getAuctionState(auctionId: string) {
    let price = await this.redisService.get(`auction:${auctionId}:price`);
    let winner = await this.redisService.get(`auction:${auctionId}:winner`);
    let version = await this.redisService.get(`auction:${auctionId}:version`);

    // If Redis keys are missing, initialise from database
    if (price === null) {
      const auction = await this.auctionRepo.findOne({ where: { id: auctionId } });
      if (auction) {
        price = auction.current_price.toString();
        winner = auction.winner_id || '';
        version = '0';

        await this.redisService.set(`auction:${auctionId}:price`, price);
        await this.redisService.set(`auction:${auctionId}:winner`, winner);
        await this.redisService.set(`auction:${auctionId}:version`, version);
      } else {
        throw new NotFoundException('Auction not found');
      }
    }

    const auction = await this.auctionRepo.findOne({ where: { id: auctionId } });
    return {
      currentPrice: price || '0',
      winnerId: winner || '',
      endTime: auction ? auction.end_time : null,
      version: version || '0',
    };
  }

  // Updated: includes totalBids count
  async getActiveAuctions(userId?: string) {
    const query = this.auctionRepo
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.product', 'product')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoin('bids', 'bid', 'bid.auction_id = auction.id')
      .addSelect('COUNT(bid.id)', 'totalBids')
      .where('auction.status = :status', { status: 'ACTIVE' })
      .groupBy('auction.id, product.id, seller.id');

    if (userId) {
      query.andHaving('product.seller_id != :userId', { userId });
    }

    const raw = await query.orderBy('auction.end_time', 'ASC').getRawAndEntities();

    const result = raw.entities.map((entity, i) => ({
      ...entity,
      totalBids: parseInt(raw.raw[i]?.totalBids || '0', 10),
    }));

    return result;
  }

  async acceptBid(auctionId: string, sellerId: string, bidId: string) {
    const auction = await this.auctionRepo.findOne({
      where: { id: auctionId },
      relations: ['product', 'product.seller'],
    });
    if (!auction || auction.status !== 'ACTIVE') {
      throw new BadRequestException('Auction is not active');
    }
    if (auction.product.seller_id !== sellerId) {
      throw new BadRequestException('Only the product seller can accept bids');
    }

    const bid = await this.bidRepo.findOne({ where: { id: bidId, auction_id: auctionId } });
    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    if (bid.amount < auction.current_price) {
      throw new BadRequestException('Bid is lower than current price');
    }

    // Close auction
    auction.status = 'COMPLETED';
    auction.winner_id = bid.user_id;
    auction.current_price = bid.amount;
    await this.auctionRepo.save(auction);

    // Remove scheduled end job
    const existingJob = await this.auctionEndQueue.getJob(`auction-end-${auctionId}`);
    if (existingJob) await existingJob.remove();

    // Create transaction for escrow
    const txn = await this.transactionService.createTransaction(
      auctionId,
      bid.user_id,
      auction.product.seller_id,
      bid.amount,
    );

    return { auction, transaction: txn };
  }
}