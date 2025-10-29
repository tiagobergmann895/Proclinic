import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { InventoryService } from '../inventory/inventory.service';

type CostInputs = {
  procedureId: string;
  itemsUsed: Array<{ itemId: string; quantity: number }>;
  durationMinutes: number; // real or default
  professionalHourlyCost: number; // from config or user profile
  overheadPerHour: number; // from env/config
  marginTarget: number; // 0.6 => 60%
};

@Injectable()
export class CostingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventory: InventoryService,
  ) {}

  async calculateCost(inputs: CostInputs) {
    const { itemsUsed, durationMinutes, professionalHourlyCost, overheadPerHour, marginTarget } = inputs;

    // Items cost: weighted average unit cost * quantity used per item
    let itemsCost = 0;
    for (const u of itemsUsed) {
      const avg = await this.inventory.getWeightedAverageUnitCost(u.itemId);
      itemsCost += avg * u.quantity;
    }

    const hours = durationMinutes / 60;
    const laborCost = professionalHourlyCost * hours;
    const overheadCost = overheadPerHour * hours;
    const totalCost = itemsCost + laborCost + overheadCost;
    const suggestedPrice = totalCost * (1 + marginTarget);

    return {
      itemsCost: round2(itemsCost),
      laborCost: round2(laborCost),
      overheadCost: round2(overheadCost),
      totalCost: round2(totalCost),
      marginTarget,
      suggestedPrice: round2(suggestedPrice),
    };
  }

  async upsertCostSheet(procedureId: string, data: ReturnType<CostingService['mapDecimal']>) {
    return this.prisma.costSheet.upsert({
      where: { procedureId },
      create: { procedureId, ...data },
      update: { ...data },
    });
  }

  mapDecimal(res: {
    itemsCost: number; laborCost: number; overheadCost: number; totalCost: number; marginTarget: number; suggestedPrice: number;
  }): {
    itemsCost: Prisma.Decimal; laborCost: Prisma.Decimal; overheadCost: Prisma.Decimal; totalCost: Prisma.Decimal; marginTarget: Prisma.Decimal; suggestedPrice: Prisma.Decimal;
  } {
    return {
      itemsCost: new Prisma.Decimal(res.itemsCost),
      laborCost: new Prisma.Decimal(res.laborCost),
      overheadCost: new Prisma.Decimal(res.overheadCost),
      totalCost: new Prisma.Decimal(res.totalCost),
      marginTarget: new Prisma.Decimal(res.marginTarget),
      suggestedPrice: new Prisma.Decimal(res.suggestedPrice),
    };
  }

  async getCostSheetByProcedure(procedureId: string) {
    return this.prisma.costSheet.findUnique({
      where: { procedureId },
      include: {
        procedure: {
          include: {
            procedureType: true,
            professional: true,
            patient: true
          }
        }
      }
    });
  }

  async getAllCostSheets(from?: string, to?: string) {
    const where: any = {};
    if (from || to) {
      where.procedure = {
        scheduledAt: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined
        }
      };
    }

    return this.prisma.costSheet.findMany({
      where,
      include: {
        procedure: {
          include: {
            procedureType: true,
            professional: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAverageCostByProcedureType(procedureTypeId: string) {
    const costSheets = await this.prisma.costSheet.findMany({
      where: {
        procedure: { procedureTypeId }
      }
    });

    if (costSheets.length === 0) {
      return null;
    }

    const totals = costSheets.reduce((acc, cs) => ({
      itemsCost: acc.itemsCost + Number(cs.itemsCost),
      laborCost: acc.laborCost + Number(cs.laborCost),
      overheadCost: acc.overheadCost + Number(cs.overheadCost),
      totalCost: acc.totalCost + Number(cs.totalCost)
    }), { itemsCost: 0, laborCost: 0, overheadCost: 0, totalCost: 0 });

    const count = costSheets.length;

    return {
      procedureTypeId,
      count,
      averageItemsCost: round2(totals.itemsCost / count),
      averageLaborCost: round2(totals.laborCost / count),
      averageOverheadCost: round2(totals.overheadCost / count),
      averageTotalCost: round2(totals.totalCost / count)
    };
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}







