import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerVerification } from './entities/seller-verification.entity';
import { UserService } from '../user/user.service';
import { IStorageService } from '../storage/storage.interface';

@Injectable()
export class SellerVerificationService {
  constructor(
    @InjectRepository(SellerVerification)
    private verificationRepo: Repository<SellerVerification>,
    private userService: UserService,
    @Inject('IStorageService') private storage: IStorageService,
  ) {}

  async applyKyc(
    userId: string,
    panNumber: string,
    files: { pan_image?: Express.Multer.File; live_selfie?: Express.Multer.File; address_proof?: Express.Multer.File },
  ) {
    if (!files.pan_image || !files.live_selfie) {
      throw new BadRequestException('Pan image and live selfie are required');
    }

    const panImageUrl = await this.storage.upload(files.pan_image, 'kyc/pan');
    const liveSelfieUrl = await this.storage.upload(files.live_selfie, 'kyc/selfie');
    let addressProofUrl: string | undefined;
    if (files.address_proof) {
      addressProofUrl = await this.storage.upload(files.address_proof, 'kyc/address');
    }

    const verification = this.verificationRepo.create({
      user_id: userId,
      pan_number: panNumber,
      pan_image_url: panImageUrl,
      live_selfie_url: liveSelfieUrl,
      address_proof_url: addressProofUrl,
      status: 'PENDING',
    });

    return this.verificationRepo.save(verification);
  }

  async getPendingVerifications(page = 1, limit = 20) {
    const [items, total] = await this.verificationRepo.findAndCount({
      where: { status: 'PENDING' },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'ASC' },
    });
    return {
      items: items.map(v => ({
        id: v.id,
        user_id: v.user_id,
        user_email: v.user.email,
        pan_number: v.pan_number,
        pan_image_url: this.storage.getUrl(v.pan_image_url),
        live_selfie_url: this.storage.getUrl(v.live_selfie_url),
        address_proof_url: v.address_proof_url ? this.storage.getUrl(v.address_proof_url) : null,
        status: v.status,
        created_at: v.created_at,
      })),
      total,
      page,
      limit,
    };
  }

  async reviewKyc(verificationId: string, adminId: string, decision: string, adminNotes?: string) {
    const verification = await this.verificationRepo.findOne({ where: { id: verificationId } });
    if (!verification) throw new NotFoundException('Verification not found');
    if (verification.status !== 'PENDING') throw new BadRequestException('Already reviewed');

    verification.status = decision;
    verification.admin_id = adminId;
    verification.admin_notes = adminNotes || undefined; // fix: use undefined instead of null
    await this.verificationRepo.save(verification);

    if (decision === 'APPROVED') {
      await this.userService.setSellerStatus(verification.user_id, true);
    }

    return verification;
  }
}