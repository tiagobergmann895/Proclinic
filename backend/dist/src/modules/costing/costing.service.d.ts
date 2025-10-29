import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
type CostInputs = {
    procedureId: string;
    itemsUsed: Array<{
        itemId: string;
        quantity: number;
    }>;
    durationMinutes: number;
    professionalHourlyCost: number;
    overheadPerHour: number;
    marginTarget: number;
};
export declare class CostingService {
    private readonly prisma;
    private readonly inventory;
    constructor(prisma: PrismaService, inventory: InventoryService);
    calculateCost(inputs: CostInputs): Promise<{
        itemsCost: number;
        laborCost: number;
        overheadCost: number;
        totalCost: number;
        marginTarget: number;
        suggestedPrice: number;
    }>;
    upsertCostSheet(procedureId: string, data: ReturnType<CostingService['mapDecimal']>): Promise<{
        id: string;
        createdAt: Date;
        marginTarget: Prisma.Decimal;
        procedureId: string;
        itemsCost: Prisma.Decimal;
        laborCost: Prisma.Decimal;
        overheadCost: Prisma.Decimal;
        totalCost: Prisma.Decimal;
        suggestedPrice: Prisma.Decimal;
    }>;
    mapDecimal(res: {
        itemsCost: number;
        laborCost: number;
        overheadCost: number;
        totalCost: number;
        marginTarget: number;
        suggestedPrice: number;
    }): {
        itemsCost: Prisma.Decimal;
        laborCost: Prisma.Decimal;
        overheadCost: Prisma.Decimal;
        totalCost: Prisma.Decimal;
        marginTarget: Prisma.Decimal;
        suggestedPrice: Prisma.Decimal;
    };
    getCostSheetByProcedure(procedureId: string): Promise<({
        procedure: {
            patient: {
                id: string;
                email: string | null;
                name: string;
                createdAt: Date;
                birthDate: Date | null;
                document: string | null;
                phone: string | null;
                address: string | null;
                consentGivenAt: Date | null;
                notes: string | null;
            };
            procedureType: {
                id: string;
                name: string;
                description: string | null;
                defaultDurationMin: number;
                defaultItems: Prisma.JsonValue;
            };
            professional: {
                id: string;
                email: string;
                name: string;
                role: import(".prisma/client").$Enums.Role;
                passwordHash: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            notes: string | null;
            scheduledAt: Date;
            startedAt: Date | null;
            finishedAt: Date | null;
            room: string | null;
            status: import(".prisma/client").$Enums.ProcedureStatus;
            patientId: string;
            professionalUserId: string;
            procedureTypeId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        marginTarget: Prisma.Decimal;
        procedureId: string;
        itemsCost: Prisma.Decimal;
        laborCost: Prisma.Decimal;
        overheadCost: Prisma.Decimal;
        totalCost: Prisma.Decimal;
        suggestedPrice: Prisma.Decimal;
    }) | null>;
    getAllCostSheets(from?: string, to?: string): Promise<({
        procedure: {
            procedureType: {
                id: string;
                name: string;
                description: string | null;
                defaultDurationMin: number;
                defaultItems: Prisma.JsonValue;
            };
            professional: {
                id: string;
                email: string;
                name: string;
                role: import(".prisma/client").$Enums.Role;
                passwordHash: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            notes: string | null;
            scheduledAt: Date;
            startedAt: Date | null;
            finishedAt: Date | null;
            room: string | null;
            status: import(".prisma/client").$Enums.ProcedureStatus;
            patientId: string;
            professionalUserId: string;
            procedureTypeId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        marginTarget: Prisma.Decimal;
        procedureId: string;
        itemsCost: Prisma.Decimal;
        laborCost: Prisma.Decimal;
        overheadCost: Prisma.Decimal;
        totalCost: Prisma.Decimal;
        suggestedPrice: Prisma.Decimal;
    })[]>;
    getAverageCostByProcedureType(procedureTypeId: string): Promise<{
        procedureTypeId: string;
        count: number;
        averageItemsCost: number;
        averageLaborCost: number;
        averageOverheadCost: number;
        averageTotalCost: number;
    } | null>;
}
export {};
