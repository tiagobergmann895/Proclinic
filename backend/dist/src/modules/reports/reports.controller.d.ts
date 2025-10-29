import { ReportsService } from './reports.service';
import { ProfitabilityQueryDto, DateRangeQueryDto } from './dto/reports.dto';
export declare class ReportsController {
    private readonly service;
    constructor(service: ReportsService);
    profitability(query: ProfitabilityQueryDto): Promise<{
        id: string;
        label: string;
        totalRevenue: number;
        totalCost: number;
        profit: number;
        margin: number;
        count: number;
    }[]>;
    stockAlerts(): Promise<any[]>;
    revenue(query: DateRangeQueryDto): Promise<{
        totalRevenue: number;
        totalPayments: number;
        period: {
            from: string | undefined;
            to: string | undefined;
        };
    }>;
    proceduresSummary(query: DateRangeQueryDto): Promise<{
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
    topProcedures(query: DateRangeQueryDto): Promise<{
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
    inventoryValue(): Promise<{
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
