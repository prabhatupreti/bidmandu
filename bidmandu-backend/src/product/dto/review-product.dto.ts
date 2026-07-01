import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class ReviewProductDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['APPROVED', 'REJECTED'])
  decision: string;

  @IsOptional()
  @IsString()
  admin_notes?: string;
}