import { Response } from 'express';
import { SettlementService } from '../../settlement/settlement.service';
import { TransactionService } from '../../transaction/transaction.service';
import { CsvService } from '../../csv/csv.service';
export declare class AdminSettlementController {
    private settlementService;
    private transactionService;
    private csvService;
    constructor(settlementService: SettlementService, transactionService: TransactionService, csvService: CsvService);
    getReadyForSettlement(): Promise<import("../../transaction/entities/transaction.entity").Transaction[]>;
    settleBatch(req: any, dto: {
        transactionIds: string[];
    }): Promise<import("../../settlement/entities/settlement-batch.entity").SettlementBatch>;
    getSettlementCsv(id: string, res: Response): Promise<void>;
}
