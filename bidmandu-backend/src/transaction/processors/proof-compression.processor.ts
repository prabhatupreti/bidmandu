import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { Inject } from '@nestjs/common';
import { IStorageService } from '../../storage/storage.interface';

@Processor('proof-compression')
export class ProofCompressionProcessor {
  constructor(
    @InjectRepository(Transaction) private txnRepo: Repository<Transaction>,
    @Inject('IStorageService') private storage: IStorageService,
  ) {}

  @Process('compress')
  async handleCompression(job: Job<{ txnId: string; originalUrl: string }>) {
    const { txnId, originalUrl } = job.data;
    try {
      // Local storage: originalUrl is a relative path like /proofs/{txnId}/uuid.jpg
      const inputPath = path.join(process.cwd(), 'uploads', originalUrl);
      const thumbDir = path.join(process.cwd(), 'uploads', 'proofs', txnId, 'thumb');
      if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });
      const outputPath = path.join(thumbDir, 'thumb.jpg');

      await sharp(inputPath)
        .resize(600)
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      // The thumbnail URL relative to server
      const thumbUrl = `/proofs/${txnId}/thumb/thumb.jpg`;

      // If using S3, we'd upload the buffer. For local, just update the entity.
      const txn = await this.txnRepo.findOne({ where: { id: txnId } });
      if (txn) {
        txn.proof_thumb_url = thumbUrl;
        await this.txnRepo.save(txn);
      }
    } catch (err) {
      console.error('Compression error', err);
      // Optionally set a placeholder
    }
  }
}