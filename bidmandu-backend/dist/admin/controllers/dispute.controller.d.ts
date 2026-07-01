import { DisputeService } from '../../dispute/dispute.service';
export declare class AdminDisputeController {
    private disputeService;
    constructor(disputeService: DisputeService);
    getDisputes(): Promise<import("../../transaction/entities/transaction.entity").Transaction[]>;
    forceConfirm(id: string, req: any): Promise<import("../../transaction/entities/transaction.entity").Transaction>;
    resetProof(id: string): Promise<import("../../transaction/entities/transaction.entity").Transaction>;
}
