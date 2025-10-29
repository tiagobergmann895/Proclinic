import { Injectable } from '@nestjs/common';
import { PriceScope, Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveMarginTarget(procedureTypeId: string): Promise<number> {
    const rule = await this.prisma.priceRule.findFirst({
      where: {
        OR: [
          { scope: PriceScope.PROCEDURE_TYPE, scopeId: procedureTypeId },
          { scope: PriceScope.GLOBAL },
        ],
      },
      orderBy: [{ scope: 'desc' }], // PROCEDURE_TYPE preferred over GLOBAL
    });
    return Number(rule?.marginTarget ?? 0.6);
  }

  validateMargins(suggestedMargin: number, min?: number, max?: number) {
    return {
      belowMin: min !== undefined ? suggestedMargin < min : false,
      aboveMax: max !== undefined ? suggestedMargin > max : false,
    };
  }

  async getAllPriceRules() {
    return this.prisma.priceRule.findMany({
      orderBy: [{ scope: 'desc' }, { createdAt: 'desc' }]
    });
  }

  async getPriceRulesByScope(scope: PriceScope, scopeId?: string) {
    const where: any = { scope };
    if (scopeId) {
      where.scopeId = scopeId;
    }
    return this.prisma.priceRule.findMany({ where });
  }

  async createPriceRule(data: {
    scope: PriceScope;
    scopeId?: string;
    marginTarget: number;
    minMargin?: number;
    maxMargin?: number;
  }) {
    return this.prisma.priceRule.create({
      data: {
        scope: data.scope,
        scopeId: data.scopeId,
        marginTarget: new Prisma.Decimal(data.marginTarget),
        minMargin: data.minMargin ? new Prisma.Decimal(data.minMargin) : null,
        maxMargin: data.maxMargin ? new Prisma.Decimal(data.maxMargin) : null
      }
    });
  }

  async updatePriceRule(id: string, data: {
    marginTarget?: number;
    minMargin?: number;
    maxMargin?: number;
  }) {
    const updateData: any = {};
    if (data.marginTarget !== undefined) {
      updateData.marginTarget = new Prisma.Decimal(data.marginTarget);
    }
    if (data.minMargin !== undefined) {
      updateData.minMargin = data.minMargin ? new Prisma.Decimal(data.minMargin) : null;
    }
    if (data.maxMargin !== undefined) {
      updateData.maxMargin = data.maxMargin ? new Prisma.Decimal(data.maxMargin) : null;
    }

    return this.prisma.priceRule.update({
      where: { id },
      data: updateData
    });
  }

  async deletePriceRule(id: string) {
    return this.prisma.priceRule.delete({
      where: { id }
    });
  }

  calculateSuggestedPrice(totalCost: number, marginTarget: number): number {
    return Math.round(totalCost * (1 + marginTarget) * 100) / 100;
  }

  calculateActualMargin(revenue: number, totalCost: number): number {
    if (revenue === 0) return 0;
    return Math.round(((revenue - totalCost) / revenue) * 10000) / 100;
  }
}







