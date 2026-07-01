import {
  Controller, Post, UseGuards, UseInterceptors, UploadedFiles, Body, Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SellerVerificationService } from './seller-verification.service';
import { KycApplyDto } from './dto/kyc-apply.dto';
import { memoryStorage } from 'multer';
import { Express } from 'express';

@Controller('kyc')
export class SellerVerificationController {
  constructor(private verificationService: SellerVerificationService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pan_image', maxCount: 1 },
        { name: 'live_selfie', maxCount: 1 },
        { name: 'address_proof', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB each
      },
    ),
  )
  async applyKyc(
    @UploadedFiles() files: { pan_image?: Express.Multer.File[]; live_selfie?: Express.Multer.File[]; address_proof?: Express.Multer.File[] },
    @Body() kycApplyDto: KycApplyDto,
    @Req() req,
  ) {
    const panImage = files.pan_image?.[0];
    const liveSelfie = files.live_selfie?.[0];
    const addressProof = files.address_proof?.[0];

    return this.verificationService.applyKyc(req.user.id, kycApplyDto.pan_number, {
      pan_image: panImage,
      live_selfie: liveSelfie,
      address_proof: addressProof,
    });
  }
}