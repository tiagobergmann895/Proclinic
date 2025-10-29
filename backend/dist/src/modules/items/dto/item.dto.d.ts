export declare class CreateItemDto {
    name: string;
    category?: string;
    unit: string;
    sku?: string;
    minStock: number;
    isControlled: boolean;
}
export declare class UpdateItemDto {
    name?: string;
    category?: string;
    unit?: string;
    sku?: string;
    minStock?: number;
    isControlled?: boolean;
}
export declare class CreateBatchDto {
    batchCode: string;
    expirationDate?: string;
    unitCost: number;
    quantity: number;
    performedByUserId: string;
}
export declare class ListItemsQueryDto {
    q?: string;
    category?: string;
    page?: number;
    pageSize?: number;
}
