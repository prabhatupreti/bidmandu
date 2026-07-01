import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  product_id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  current_price: number;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column({ default: 120 })
  soft_close_window: number;

  @Column({ default: 0 })
  extension_count: number;

  @Column({ default: 'ACTIVE' })
  status: string; // ACTIVE, COMPLETED, CANCELLED

  @Column({ nullable: true, type: 'uuid' })
  winner_id: string | null;
}