import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        totalUsers: number;
        totalSellers: number;
        totalProducts: number;
        activeAuctions: number;
        completedTransactions: number;
        totalRevenue: number;
    }>;
}
