import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettlementBatch } from '../settlement/entities/settlement-batch.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CsvService {
  constructor(
    @InjectRepository(SettlementBatch) private batchRepo: Repository<SettlementBatch>,
    @InjectRepository(Transaction) private txnRepo: Repository<Transaction>,
  ) {}

  async generateSettlementCsv(batchId: string): Promise<string> {
    const batch = await this.batchRepo.findOne({ where: { id: batchId } });
    if (!batch) throw new Error('Batch not found');

    const txns = await this.txnRepo.find({ where: { settlement_batch_id: batchId }, relations: ['seller'] });
    const header = 'Seller Name,Bank Account,IFSC,Amount,Reference\n';
    const rows = txns.map(txn => {
      const seller = txn.seller as any;
      const name = seller.email; // later we can use seller's actual name from KYC
      const bankAccount = 'N/A'; // would come from seller's bank details (not yet implemented)
      const ifsc = 'N/A';
      return `${name},${bankAccount},${ifsc},${txn.payout_amount},${txn.payment_ref_code}`;
    }).join('\n');

    const csvContent = header + rows;
    const fileName = `settlement_batch_${batchId}.csv`;
    const filePath = path.join(process.cwd(), 'exports', fileName);
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, csvContent, 'utf-8');

    // Update batch with csv file URL
    batch.csv_file_url = filePath; // in production we'd upload to S3
    await this.batchRepo.save(batch);

    return filePath;
  }
}