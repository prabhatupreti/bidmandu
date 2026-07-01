import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string; // Store hashed in production, plain for MVP

  @Column({ default: false })
  is_seller: boolean;

  @Column({ default: 'BUYER' })
  role: string; // 'BUYER', 'SELLER', 'ADMIN' – simplified roles for MVP

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}