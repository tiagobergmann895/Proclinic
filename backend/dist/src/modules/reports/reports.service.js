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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async profitability(from, to, groupBy) {
        var _a;
        const where = {};
        if (from || to) {
            where.finishedAt = { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined };
        }
        const procedures = await this.prisma.procedure.findMany({ where, include: { costSheet: true, procedureType: true, professional: true } });
        const map = new Map();
        for (const p of procedures) {
            const key = groupBy === 'professional' ? p.professionalUserId : p.procedureTypeId;
            const label = groupBy === 'professional' ? p.professional.name : p.procedureType.name;
            const rec = map.get(key) || { totalRevenue: 0, totalCost: 0, count: 0, label };
            const paid = await this.prisma.payment.aggregate({ _sum: { amount: true }, where: { procedureId: p.id } });
            rec.totalRevenue += Number(paid._sum.amount || 0);
            rec.totalCost += Number(((_a = p.costSheet) === null || _a === void 0 ? void 0 : _a.totalCost) || 0);
            rec.count += 1;
            map.set(key, rec);
        }
        return Array.from(map.entries()).map(([id, v]) => ({ id, label: v.label, totalRevenue: v.totalRevenue, totalCost: v.totalCost, profit: v.totalRevenue - v.totalCost, margin: v.totalRevenue ? (v.totalRevenue - v.totalCost) / v.totalRevenue : 0, count: v.count }));
    }
    async stockAlerts() {
        const items = await this.prisma.item.findMany({ include: { batches: true } });
        const alerts = [];
        const now = new Date();
        const soon = new Date(now.getTime() + 30 * 24 * 3600 * 1000);
        for (const it of items) {
            const total = it.batches.reduce((acc, b) => acc + Number(b.quantityAvailable), 0);
            if (total < it.minStock)
                alerts.push({ type: 'MIN_STOCK', itemId: it.id, name: it.name, total });
            for (const b of it.batches) {
                if (b.expirationDate && b.expirationDate <= soon) {
                    alerts.push({ type: 'EXPIRING', itemId: it.id, name: it.name, batchId: b.id, batchCode: b.batchCode, expirationDate: b.expirationDate });
                }
            }
        }
        return alerts;
    }
    async getTotalRevenue(from, to) {
        const where = {};
        if (from || to) {
            where.createdAt = {
                gte: from ? new Date(from) : undefined,
                lte: to ? new Date(to) : undefined
            };
        }
        const payments = await this.prisma.payment.aggregate({
            _sum: { amount: true },
            _count: true,
            where: { ...where, status: 'COMPLETED' }
        });
        return {
            totalRevenue: Number(payments._sum.amount || 0),
            totalPayments: payments._count,
            period: { from, to }
        };
    }
    async getProceduresSummary(from, to) {
        const where = {};
        if (from || to) {
            where.scheduledAt = {
                gte: from ? new Date(from) : undefined,
                lte: to ? new Date(to) : undefined
            };
        }
        const procedures = await this.prisma.procedure.groupBy({
            by: ['status'],
            _count: true,
            where
        });
        const total = await this.prisma.procedure.count({ where });
        return {
            total,
            byStatus: procedures.map(p => ({
                status: p.status,
                count: p._count
            })),
            period: { from, to }
        };
    }
    async getTopProcedures(from, to, limit = 10) {
        const where = {};
        if (from || to) {
            where.scheduledAt = {
                gte: from ? new Date(from) : undefined,
                lte: to ? new Date(to) : undefined
            };
        }
        const procedures = await this.prisma.procedure.groupBy({
            by: ['procedureTypeId'],
            _count: true,
            where,
            orderBy: { _count: { procedureTypeId: 'desc' } },
            take: limit
        });
        const enriched = await Promise.all(procedures.map(async (p) => {
            const procedureType = await this.prisma.procedureType.findUnique({
                where: { id: p.procedureTypeId }
            });
            return {
                procedureTypeId: p.procedureTypeId,
                procedureTypeName: (procedureType === null || procedureType === void 0 ? void 0 : procedureType.name) || 'Unknown',
                count: p._count
            };
        }));
        return {
            topProcedures: enriched,
            period: { from, to }
        };
    }
    async getInventoryValue() {
        const batches = await this.prisma.itemBatch.findMany({
            where: { quantityAvailable: { gt: 0 } },
            include: { item: true }
        });
        let totalValue = 0;
        let totalItems = 0;
        const itemsValue = batches.map(batch => {
            const batchValue = Number(batch.quantityAvailable) * Number(batch.unitCost);
            totalValue += batchValue;
            totalItems += Number(batch.quantityAvailable);
            return {
                itemId: batch.itemId,
                itemName: batch.item.name,
                batchCode: batch.batchCode,
                quantity: Number(batch.quantityAvailable),
                unitCost: Number(batch.unitCost),
                totalValue: batchValue
            };
        });
        return {
            totalValue: Math.round(totalValue * 100) / 100,
            totalItems,
            itemsCount: batches.length,
            items: itemsValue
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map