import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('settlement_batches')
export class SettlementBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  admin_id: string;

  @Column({ default: 'OPEN' })
  status: string; // OPEN, EXPORTED

  @Column('decimal', { precision: 14, scale: 2, default: 0 })
  total_amount: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0 })
  total_fee: number;

  @Column({ nullable: true })
  csv_file_url: string;

  @CreateDateColumn()
  created_at: Date;
}