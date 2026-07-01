import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Auction } from '../../auction/entities/auction.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Auction)
  @JoinColumn({ name: 'auction_id' })
  auction: Auction;

  @Column()
  auction_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @Column()
  buyer_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column()
  seller_id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ unique: true })
  payment_ref_code: string;

  @Column({ default: 'AWAITING_PAYMENT' })
  status: string;

  @Column({ nullable: true, type: 'varchar' })
  proof_image_url: string | null;

  @Column({ nullable: true, type: 'varchar' })
  proof_thumb_url: string | null;

  @Column({ nullable: true })
  admin_verified_at: Date;

  @Column({ nullable: true })
  admin_notes: string;

  @Column({ nullable: true, type: 'text' })
  shipping_details: string | null;

  @Column({ nullable: true })
  buyer_confirmed_at: Date;

  @Column({ nullable: true })
  settlement_batch_id: string;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  payout_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}