import { Injectable } from '@nestjs/common';
import { Prisma, MovementType } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';

type ConsumeItemInput = {
  itemId: string;
  quantity: number; // in item unit
  procedureId?: string;
  performedByUserId: string;
};

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async fefoBatches(itemId: string) {
    return this.prisma.itemBatch.findMany({
      where: { itemId },
      orderBy: [
        { expirationDate: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async getWeightedAverageUnitCost(itemId: string): Promise<number> {
    const batches = await this.prisma.itemBatch.findMany({
      where: { itemId },
      select: { unitCost: true, quantityAvailable: true },
    });
    let totalQty = 0;
    let totalCost = 0;
    for (const b of batches) {
      const qty = Number(b.quantityAvailable);
      const cost = Number(b.unitCost);
      totalQty += qty;
      totalCost += qty * cost;
    }
    if (totalQty <= 0) return 0;
    return totalCost / totalQty;
  }

  // Consumes quantity following FEFO, creates EXIT movements. Supports negative stock (backorder) if insufficient.
  async consumeItem(input: ConsumeItemInput) {
    const { itemId, quantity, procedureId, performedByUserId } = input;
    if (quantity <= 0) return [];
    const movements: Prisma.InventoryMovementCreateManyInput[] = [];
    let remaining = quantity;
    const batches = await this.fefoBatches(itemId);

    for (const batch of batches) {
      if (remaining <= 0) break;
      const available = Number(batch.quantityAvailable);
      if (available <= 0) continue;
      const consume = Math.min(available, remaining);
      remaining -= consume;
      // Update batch quantity
      await this.prisma.itemBatch.update({
        where: { id: batch.id },
        data: { quantityAvailable: new Prisma.Decimal(available - consume) },
      });
      movements.push({
        itemId,
        batchId: batch.id,
        type: MovementType.EXIT,
        quantity: new Prisma.Decimal(consume),
        unitCost: batch.unitCost,
        reason: 'PROCEDURE_CONSUMPTION',
        linkedProcedureId: procedureId,
        performedByUserId,
      });
    }

    // Backorder if still remaining
    if (remaining > 0) {
      movements.push({
        itemId,
        batchId: null,
        type: MovementType.EXIT,
        quantity: new Prisma.Decimal(remaining),
        unitCost: null,
        reason: 'BACKORDER_NEGATIVE_STOCK',
        linkedProcedureId: procedureId,
        performedByUserId,
      });
    }

    if (movements.length > 0) {
      await this.prisma.inventoryMovement.createMany({ data: movements });
    }
    return movements;
  }
}














