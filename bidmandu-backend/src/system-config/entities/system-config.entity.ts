import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('system_configs')
export class SystemConfig {
  @PrimaryColumn()
  key: string;

  @Column('text')
  value: string;
}