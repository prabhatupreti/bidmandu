import { IStorageService } from './storage.interface';
export declare class LocalStorageService implements IStorageService {
    private basePath;
    constructor();
    upload(file: Express.Multer.File, folder: string): Promise<string>;
    getUrl(filePath: string): string;
    delete(filePath: string): Promise<void>;
}
