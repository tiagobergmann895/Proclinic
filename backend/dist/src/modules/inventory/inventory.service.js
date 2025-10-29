"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../common/prisma.service");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async fefoBatches(itemId) {
        return this.prisma.itemBatch.findMany({
            where: { itemId },
            orderBy: [
                { expirationDate: 'asc' },
                { createdAt: 'asc' },
            ],
        });
    }
    async getWeightedAverageUnitCost(itemId) {
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
        if (totalQty <= 0)
            return 0;
        return totalCost / totalQty;
    }
    async consumeItem(input) {
        const { itemId, quantity, procedureId, performedByUserId } = input;
        if (quantity <= 0)
            return [];
        const movements = [];
        let remaining = quantity;
        const batches = await this.fefoBatches(itemId);
        for (const batch of batches) {
            if (remaining <= 0)
                break;
            const available = Number(batch.quantityAvailable);
            if (available <= 0)
                continue;
            const consume = Math.min(available, remaining);
            remaining -= consume;
            await this.prisma.itemBatch.update({
                where: { id: batch.id },
                data: { quantityAvailable: new client_1.Prisma.Decimal(available - consume) },
            });
            movements.push({
                itemId,
                batchId: batch.id,
                type: client_1.MovementType.EXIT,
                quantity: new client_1.Prisma.Decimal(consume),
                unitCost: batch.unitCost,
                reason: 'PROCEDURE_CONSUMPTION',
                linkedProcedureId: procedureId,
                performedByUserId,
            });
        }
        if (remaining > 0) {
            movements.push({
                itemId,
                batchId: null,
                type: client_1.MovementType.EXIT,
                quantity: new client_1.Prisma.Decimal(remaining),
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map