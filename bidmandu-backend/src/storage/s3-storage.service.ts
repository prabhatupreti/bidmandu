import { Injectable } from '@nestjs/common';
import { IStorageService } from './storage.interface';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class S3StorageService implements IStorageService {
  private s3: AWS.S3;
  private bucket: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucket = process.env.AWS_S3_BUCKET || '';
  }

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    const ext = path.extname(file.originalname);
    const key = `${folder}/${uuid()}${ext}`;
    await this.s3.upload({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }).promise();
    return key;
  }

  getUrl(key: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  async delete(key: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.bucket,
      Key: key,
    }).promise();
  }
}