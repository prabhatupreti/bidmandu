import { Injectable } from '@nestjs/common';
import { IStorageService } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LocalStorageService implements IStorageService {
  private basePath: string;

  constructor() {
    this.basePath = process.env.STORAGE_LOCAL_PATH || './uploads';
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    const destFolder = path.join(this.basePath, folder);
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }
    const ext = path.extname(file.originalname);
    const fileName = uuid() + ext;
    const fullPath = path.join(destFolder, fileName);
    fs.writeFileSync(fullPath, file.buffer);
    return `/${folder}/${fileName}`;
  }

  getUrl(filePath: string): string {
    return `${process.env.APP_URL || 'http://localhost:3000'}${filePath}`;
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}