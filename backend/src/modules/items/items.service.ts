import { Injectable } from '@nestjs/common';
import { Prisma, MovementType } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(data: any) {
    return this.prisma.item.create({ data });
  }

  get(id: string) {
    return this.prisma.item.findUnique({ where: { id }, include: { batches: true } });
  }

  update(id: string, data: any) {
    return this.prisma.item.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.item.delete({ where: { id } });
  }

  // Batches
  createBatch(itemId: string, batch: { batchCode: string; expirationDate?: Date; unitCost: number; quantity: number }, performedByUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.itemBatch.create({
        data: {
          itemId,
          batchCode: batch.batchCode,
          expirationDate: batch.expirationDate ?? null,
          unitCost: new Prisma.Decimal(batch.unitCost),
          quantityAvailable: new Prisma.Decimal(batch.quantity),
        },
      });
      await tx.inventoryMovement.create({
        data: {
          itemId,
          batchId: created.id,
          type: MovementType.ENTRY,
          quantity: new Prisma.Decimal(batch.quantity),
          unitCost: new Prisma.Decimal(batch.unitCost),
          reason: 'BATCH_ENTRY',
          performedByUserId,
        },
      });
      return created;
    });
  }
}














