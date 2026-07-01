import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column()
  seller_id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ default: 'Other' })
  category: string;

  @Column({ nullable: true })
  condition: string;                     // NEW

  @Column('decimal', { precision: 12, scale: 2 })
  starting_price: number;

  @Column('simple-array', { nullable: true })
  image_urls: string[];

  @Column({ default: 'DRAFT' })
  admin_approval_status: string;

  @Column({ nullable: true })
  admin_approved_at: Date;

  @Column({ nullable: true, type: 'text' })
  admin_notes: string | null;

  @CreateDateColumn()
  created_at: Date;
}