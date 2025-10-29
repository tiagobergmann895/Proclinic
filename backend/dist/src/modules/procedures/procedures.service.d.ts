import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CostingService } from '../costing/costing.service';
import { PricingService } from '../pricing/pricing.service';
export declare class ProceduresService {
    private readonly prisma;
    private readonly inventory;
    private readonly costing;
    private readonly pricing;
    constructor(prisma: PrismaService, inventory: InventoryService, costing: CostingService, pricing: PricingService);
    finishProcedure(params: {
        procedureId: string;
        performedByUserId: string;
        itemsOverride?: Array<{
            itemId: string;
            quantity: number;
        }>;
        actualDurationMin?: number;
        professionalHourlyCost?: number;
    }): Promise<{
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
}
