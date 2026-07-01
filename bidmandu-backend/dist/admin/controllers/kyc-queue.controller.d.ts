import { SellerVerificationService } from '../../seller-verification/seller-verification.service';
import { KycReviewDto } from '../../seller-verification/dto/kyc-review.dto';
export declare class KycQueueController {
    private verificationService;
    constructor(verificationService: SellerVerificationService);
    getKycQueue(page?: number, limit?: number): Promise<{
        items: {
            id: string;
            user_id: string;
            user_email: string;
            pan_number: string;
            pan_image_url: string;
            live_selfie_url: string;
            address_proof_url: string | null;
            status: string;
            created_at: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    approveKyc(id: string, req: any, reviewDto: KycReviewDto): Promise<import("../../seller-verification/entities/seller-verification.entity").SellerVerification>;
    rejectKyc(id: string, req: any, reviewDto: KycReviewDto): Promise<import("../../seller-verification/entities/seller-verification.entity").SellerVerification>;
}
