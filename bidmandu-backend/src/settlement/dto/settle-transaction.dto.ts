import { IsUUID, IsArray } from 'class-validator';

export class SettleTransactionsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  transactionIds: string[];
}