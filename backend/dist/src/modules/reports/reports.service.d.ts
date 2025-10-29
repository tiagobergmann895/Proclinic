import { PrismaService } from '../../common/prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    profitability(from?: string, to?: string, groupBy?: 'procedureType' | 'professional'): Promise<{
        id: string;
        label: string;
        totalRevenue: number;
        totalCost: number;
        profit: number;
        margin: number;
        count: number;
    }[]>;
    stockAlerts(): Promise<any[]>;
    getTotalRevenue(from?: string, to?: string): Promise<{
        totalRevenue: number;
        totalPayments: number;
        period: {
            from: string | undefined;
            to: string | undefined;
        };
    }>;
    getProceduresSummary(from?: string, to?: string): Promise<{
        total: number;
        byStatus: {
            status: import(".prisma/client").$Enums.ProcedureStatus;
            count: number;
        }[];
        period: {
            from: string | undefined;
            to: string | undefined;
        };
    }>;
    getTopProcedures(from?: string, to?: string, limit?: number): Promise<{
        topProcedures: {
            procedureTypeId: string;
            procedureTypeName: string;
            count: number;
        }[];
        period: {
            from: string | undefined;
            to: string | undefined;
        };
    }>;
    getInventoryValue(): Promise<{
        totalValue: number;
        totalItems: number;
        itemsCount: number;
        items: {
            itemId: string;
            itemName: string;
            batchCode: string;
            quantity: number;
            unitCost: number;
            totalValue: number;
        }[];
    }>;
}
