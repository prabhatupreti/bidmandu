import { Repository } from 'typeorm';
import { SellerVerification } from './entities/seller-verification.entity';
import { UserService } from '../user/user.service';
import { IStorageService } from '../storage/storage.interface';
export declare class SellerVerificationService {
    private verificationRepo;
    private userService;
    private storage;
    constructor(verificationRepo: Repository<SellerVerification>, userService: UserService, storage: IStorageService);
    applyKyc(userId: string, panNumber: string, files: {
        pan_image?: Express.Multer.File;
        live_selfie?: Express.Multer.File;
        address_proof?: Express.Multer.File;
    }): Promise<SellerVerification>;
    getPendingVerifications(page?: number, limit?: number): Promise<{
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
    reviewKyc(verificationId: string, adminId: string, decision: string, adminNotes?: string): Promise<SellerVerification>;
}
