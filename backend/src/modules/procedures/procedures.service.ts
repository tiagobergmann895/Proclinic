import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, ProcedureStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CostingService } from '../costing/costing.service';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class ProceduresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventory: InventoryService,
    private readonly costing: CostingService,
    private readonly pricing: PricingService,
  ) {}

  async finishProcedure(params: { procedureId: string; performedByUserId: string; itemsOverride?: Array<{ itemId: string; quantity: number }>; actualDurationMin?: number; professionalHourlyCost?: number; }) {
    const proc = await this.prisma.procedure.findUnique({
      where: { id: params.procedureId },
      include: { procedureType: true, patient: true, professional: true },
    });
    if (!proc) throw new BadRequestException('Procedimento não encontrado');
    if (!proc.patientId || !proc.professionalUserId) {
      throw new BadRequestException('Paciente e profissional obrigatórios');
    }

    const defaultItems: Array<{ itemId?: string; itemSku?: string; quantity: number }> = (proc.procedureType.defaultItems as any) || [];
    // Map default by SKU to itemId
    const resolvedDefault = await Promise.all(
      defaultItems.map(async (di) => {
        if (di.itemId) return di as { itemId: string; quantity: number };
        if (!di.itemSku) return null;
        const item = await this.prisma.item.findFirst({ where: { sku: di.itemSku } });
        return item ? { itemId: item.id, quantity: di.quantity } : null;
      }),
    );
    const baseItems = resolvedDefault.filter(Boolean) as Array<{ itemId: string; quantity: number }>;
    const itemsUsed = params.itemsOverride ?? baseItems;

    // Consume stock via FEFO
    for (const u of itemsUsed) {
      await this.inventory.consumeItem({
        itemId: u.itemId,
        quantity: u.quantity,
        procedureId: proc.id,
        performedByUserId: params.performedByUserId,
      });
    }

    // Costing
    const durationMin = params.actualDurationMin ?? proc.procedureType.defaultDurationMin;
    const professionalHourlyCost = params.professionalHourlyCost ?? 200; // default assumption, document in README
    const overheadPerHour = Number(process.env.OVERHEAD_RATE_PER_HOUR ?? 100);
    const marginTarget = await this.pricing.resolveMarginTarget(proc.procedureTypeId);
    const res = await this.costing.calculateCost({
      procedureId: proc.id,
      itemsUsed,
      durationMinutes: durationMin,
      professionalHourlyCost,
      overheadPerHour,
      marginTarget,
    });
    const sheet = await this.costing.upsertCostSheet(proc.id, this.costing.mapDecimal(res));

    // Update procedure status/timestamps
    await this.prisma.procedure.update({
      where: { id: proc.id },
      data: { status: ProcedureStatus.DONE, finishedAt: new Date() },
    });

    return sheet;
  }
}














