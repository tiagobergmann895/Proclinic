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
exports.CostingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../common/prisma.service");
const inventory_service_1 = require("../inventory/inventory.service");
let CostingService = class CostingService {
    constructor(prisma, inventory) {
        this.prisma = prisma;
        this.inventory = inventory;
    }
    async calculateCost(inputs) {
        const { itemsUsed, durationMinutes, professionalHourlyCost, overheadPerHour, marginTarget } = inputs;
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
    async upsertCostSheet(procedureId, data) {
        return this.prisma.costSheet.upsert({
            where: { procedureId },
            create: { procedureId, ...data },
            update: { ...data },
        });
    }
    mapDecimal(res) {
        return {
            itemsCost: new client_1.Prisma.Decimal(res.itemsCost),
            laborCost: new client_1.Prisma.Decimal(res.laborCost),
            overheadCost: new client_1.Prisma.Decimal(res.overheadCost),
            totalCost: new client_1.Prisma.Decimal(res.totalCost),
            marginTarget: new client_1.Prisma.Decimal(res.marginTarget),
            suggestedPrice: new client_1.Prisma.Decimal(res.suggestedPrice),
        };
    }
    async getCostSheetByProcedure(procedureId) {
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
    async getAllCostSheets(from, to) {
        const where = {};
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
    async getAverageCostByProcedureType(procedureTypeId) {
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
};
exports.CostingService = CostingService;
exports.CostingService = CostingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inventory_service_1.InventoryService])
], CostingService);
function round2(n) {
    return Math.round(n * 100) / 100;
}
//# sourceMappingURL=costing.service.js.map