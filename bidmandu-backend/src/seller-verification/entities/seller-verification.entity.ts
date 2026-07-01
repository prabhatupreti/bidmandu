import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('seller_verifications')
export class SellerVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  pan_number: string;

  @Column()
  pan_image_url: string;

  @Column()
  live_selfie_url: string;

  @Column({ nullable: true })
  address_proof_url?: string;

  @Column({ default: 'PENDING' })
  status: string; // PENDING, APPROVED, REJECTED

  @Column({ nullable: true })
  admin_notes?: string;

  @Column({ nullable: true })
  admin_id?: string;

  @CreateDateColumn()
  created_at: Date;
}