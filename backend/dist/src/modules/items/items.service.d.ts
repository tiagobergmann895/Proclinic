import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
export declare class ItemsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        unit: string;
        sku: string | null;
        minStock: number;
        isControlled: boolean;
    }[]>;
    create(data: any): Prisma.Prisma__ItemClient<{
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        unit: string;
        sku: string | null;
        minStock: number;
        isControlled: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    get(id: string): Prisma.Prisma__ItemClient<({
        batches: {
            id: string;
            createdAt: Date;
            batchCode: string;
            expirationDate: Date | null;
            unitCost: Prisma.Decimal;
            quantityAvailable: Prisma.Decimal;
            itemId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        unit: string;
        sku: string | null;
        minStock: number;
        isControlled: boolean;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: any): Prisma.Prisma__ItemClient<{
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        unit: string;
        sku: string | null;
        minStock: number;
        isControlled: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): Prisma.Prisma__ItemClient<{
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        unit: string;
        sku: string | null;
        minStock: number;
        isControlled: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createBatch(itemId: string, batch: {
        batchCode: string;
        expirationDate?: Date;
        unitCost: number;
        quantity: number;
    }, performedByUserId: string): Promise<{
        id: string;
        createdAt: Date;
        batchCode: string;
        expirationDate: Date | null;
        unitCost: Prisma.Decimal;
        quantityAvailable: Prisma.Decimal;
        itemId: string;
    }>;
}
