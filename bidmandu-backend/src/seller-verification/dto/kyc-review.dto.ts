import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class KycReviewDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['APPROVED', 'REJECTED'])
  decision: string;

  @IsOptional()
  @IsString()
  admin_notes?: string;
}