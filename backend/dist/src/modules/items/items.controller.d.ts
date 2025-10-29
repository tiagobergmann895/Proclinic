import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto, CreateBatchDto, ListItemsQueryDto } from './dto/item.dto';
export declare class ItemsController {
    private readonly service;
    constructor(service: ItemsService);
    list(query: ListItemsQueryDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        unit: string;
        sku: string | null;
        minStock: number;
        isControlled: boolean;
    }[]>;
    create(body: CreateItemDto): import(".prisma/client").Prisma.Prisma__ItemClient<{
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        unit: string;
        sku: string | null;
        minStock: number;
        isControlled: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    get(id: string): import(".prisma/client").Prisma.Prisma__ItemClient<({
        batches: {
            id: string;
            createdAt: Date;
            batchCode: string;
            expirationDate: Date | null;
            unitCost: import("@prisma/client/runtime/library").Decimal;
            quantityAvailable: import("@prisma/client/runtime/library").Decimal;
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
    update(id: string, body: UpdateItemDto): import(".prisma/client").Prisma.Prisma__ItemClient<{
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        unit: string;
        sku: string | null;
        minStock: number;
        isControlled: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ItemClient<{
        id: string;
        name: string;
        createdAt: Date;
        category: string | null;
        unit: string;
        sku: string | null;
        minStock: number;
        isControlled: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createBatch(itemId: string, body: CreateBatchDto): Promise<{
        id: string;
        createdAt: Date;
        batchCode: string;
        expirationDate: Date | null;
        unitCost: import("@prisma/client/runtime/library").Decimal;
        quantityAvailable: import("@prisma/client/runtime/library").Decimal;
        itemId: string;
    }>;
}
