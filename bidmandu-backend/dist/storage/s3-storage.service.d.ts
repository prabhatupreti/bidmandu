import { IStorageService } from './storage.interface';
export declare class S3StorageService implements IStorageService {
    private s3;
    private bucket;
    constructor();
    upload(file: Express.Multer.File, folder: string): Promise<string>;
    getUrl(key: string): string;
    delete(key: string): Promise<void>;
}
