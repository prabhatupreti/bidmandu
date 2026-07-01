export interface IStorageService {
  upload(file: Express.Multer.File, path: string): Promise<string>; // returns URL or path
  getUrl(path: string): string;
  delete(path: string): Promise<void>;
}