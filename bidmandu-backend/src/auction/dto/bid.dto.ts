import { IsUUID, IsNumber, Min } from 'class-validator';

export class PlaceBidDto {
  @IsUUID()
  auctionId: string;

  @IsNumber()
  @Min(0)
  amount: number;
}