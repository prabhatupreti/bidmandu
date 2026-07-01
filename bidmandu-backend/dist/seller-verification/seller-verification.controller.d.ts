import { SellerVerificationService } from './seller-verification.service';
import { KycApplyDto } from './dto/kyc-apply.dto';
export declare class SellerVerificationController {
    private verificationService;
    constructor(verificationService: SellerVerificationService);
    applyKyc(files: {
        pan_image?: Express.Multer.File[];
        live_selfie?: Express.Multer.File[];
        address_proof?: Express.Multer.File[];
    }, kycApplyDto: KycApplyDto, req: any): Promise<import("./entities/seller-verification.entity").SellerVerification>;
}
