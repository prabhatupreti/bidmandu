import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class KycApplyDto {
  @IsNotEmpty()
  @IsString()
  pan_number: string;

  // Files handled by Multer: pan_image, live_selfie, address_proof (optional)
}