import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
type ConsumeItemInput = {
    itemId: string;
    quantity: number;
    procedureId?: string;
    performedByUserId: string;
};
export declare class InventoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    fefoBatches(itemId: string): Promise<{
        id: string;
        createdAt: Date;
        batchCode: string;
        expirationDate: Date | null;
        unitCost: Prisma.Decimal;
        quantityAvailable: Prisma.Decimal;
        itemId: string;
    }[]>;
    getWeightedAverageUnitCost(itemId: string): Promise<number>;
    consumeItem(input: ConsumeItemInput): Promise<Prisma.InventoryMovementCreateManyInput[]>;
}
export {};
