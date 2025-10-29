import { PriceScope, Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
export declare class PricingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolveMarginTarget(procedureTypeId: string): Promise<number>;
    validateMargins(suggestedMargin: number, min?: number, max?: number): {
        belowMin: boolean;
        aboveMax: boolean;
    };
    getAllPriceRules(): Promise<{
        id: string;
        scope: import(".prisma/client").$Enums.PriceScope;
        scopeId: string | null;
        marginTarget: Prisma.Decimal;
        minMargin: Prisma.Decimal;
        maxMargin: Prisma.Decimal;
        dynamicAdjustments: Prisma.JsonValue | null;
    }[]>;
    getPriceRulesByScope(scope: PriceScope, scopeId?: string): Promise<{
        id: string;
        scope: import(".prisma/client").$Enums.PriceScope;
        scopeId: string | null;
        marginTarget: Prisma.Decimal;
        minMargin: Prisma.Decimal;
        maxMargin: Prisma.Decimal;
        dynamicAdjustments: Prisma.JsonValue | null;
    }[]>;
    createPriceRule(data: {
        scope: PriceScope;
        scopeId?: string;
        marginTarget: number;
        minMargin?: number;
        maxMargin?: number;
    }): Promise<{
        id: string;
        scope: import(".prisma/client").$Enums.PriceScope;
        scopeId: string | null;
        marginTarget: Prisma.Decimal;
        minMargin: Prisma.Decimal;
        maxMargin: Prisma.Decimal;
        dynamicAdjustments: Prisma.JsonValue | null;
    }>;
    updatePriceRule(id: string, data: {
        marginTarget?: number;
        minMargin?: number;
        maxMargin?: number;
    }): Promise<{
        id: string;
        scope: import(".prisma/client").$Enums.PriceScope;
        scopeId: string | null;
        marginTarget: Prisma.Decimal;
        minMargin: Prisma.Decimal;
        maxMargin: Prisma.Decimal;
        dynamicAdjustments: Prisma.JsonValue | null;
    }>;
    deletePriceRule(id: string): Promise<{
        id: string;
        scope: import(".prisma/client").$Enums.PriceScope;
        scopeId: string | null;
        marginTarget: Prisma.Decimal;
        minMargin: Prisma.Decimal;
        maxMargin: Prisma.Decimal;
        dynamicAdjustments: Prisma.JsonValue | null;
    }>;
    calculateSuggestedPrice(totalCost: number, marginTarget: number): number;
    calculateActualMargin(revenue: number, totalCost: number): number;
}
