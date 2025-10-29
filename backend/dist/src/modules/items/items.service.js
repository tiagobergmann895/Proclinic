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
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../common/prisma.service");
let ItemsService = class ItemsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list() {
        return this.prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
    }
    create(data) {
        return this.prisma.item.create({ data });
    }
    get(id) {
        return this.prisma.item.findUnique({ where: { id }, include: { batches: true } });
    }
    update(id, data) {
        return this.prisma.item.update({ where: { id }, data });
    }
    remove(id) {
        return this.prisma.item.delete({ where: { id } });
    }
    createBatch(itemId, batch, performedByUserId) {
        return this.prisma.$transaction(async (tx) => {
            var _a;
            const created = await tx.itemBatch.create({
                data: {
                    itemId,
                    batchCode: batch.batchCode,
                    expirationDate: (_a = batch.expirationDate) !== null && _a !== void 0 ? _a : null,
                    unitCost: new client_1.Prisma.Decimal(batch.unitCost),
                    quantityAvailable: new client_1.Prisma.Decimal(batch.quantity),
                },
            });
            await tx.inventoryMovement.create({
                data: {
                    itemId,
                    batchId: created.id,
                    type: client_1.MovementType.ENTRY,
                    quantity: new client_1.Prisma.Decimal(batch.quantity),
                    unitCost: new client_1.Prisma.Decimal(batch.unitCost),
                    reason: 'BATCH_ENTRY',
                    performedByUserId,
                },
            });
            return created;
        });
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ItemsService);
//# sourceMappingURL=items.service.js.map