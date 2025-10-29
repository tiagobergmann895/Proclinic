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
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../common/prisma.service");
let PricingService = class PricingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveMarginTarget(procedureTypeId) {
        var _a;
        const rule = await this.prisma.priceRule.findFirst({
            where: {
                OR: [
                    { scope: client_1.PriceScope.PROCEDURE_TYPE, scopeId: procedureTypeId },
                    { scope: client_1.PriceScope.GLOBAL },
                ],
            },
            orderBy: [{ scope: 'desc' }],
        });
        return Number((_a = rule === null || rule === void 0 ? void 0 : rule.marginTarget) !== null && _a !== void 0 ? _a : 0.6);
    }
    validateMargins(suggestedMargin, min, max) {
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
    async getPriceRulesByScope(scope, scopeId) {
        const where = { scope };
        if (scopeId) {
            where.scopeId = scopeId;
        }
        return this.prisma.priceRule.findMany({ where });
    }
    async createPriceRule(data) {
        return this.prisma.priceRule.create({
            data: {
                scope: data.scope,
                scopeId: data.scopeId,
                marginTarget: new client_1.Prisma.Decimal(data.marginTarget),
                minMargin: data.minMargin ? new client_1.Prisma.Decimal(data.minMargin) : null,
                maxMargin: data.maxMargin ? new client_1.Prisma.Decimal(data.maxMargin) : null
            }
        });
    }
    async updatePriceRule(id, data) {
        const updateData = {};
        if (data.marginTarget !== undefined) {
            updateData.marginTarget = new client_1.Prisma.Decimal(data.marginTarget);
        }
        if (data.minMargin !== undefined) {
            updateData.minMargin = data.minMargin ? new client_1.Prisma.Decimal(data.minMargin) : null;
        }
        if (data.maxMargin !== undefined) {
            updateData.maxMargin = data.maxMargin ? new client_1.Prisma.Decimal(data.maxMargin) : null;
        }
        return this.prisma.priceRule.update({
            where: { id },
            data: updateData
        });
    }
    async deletePriceRule(id) {
        return this.prisma.priceRule.delete({
            where: { id }
        });
    }
    calculateSuggestedPrice(totalCost, marginTarget) {
        return Math.round(totalCost * (1 + marginTarget) * 100) / 100;
    }
    calculateActualMargin(revenue, totalCost) {
        if (revenue === 0)
            return 0;
        return Math.round(((revenue - totalCost) / revenue) * 10000) / 100;
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PricingService);
//# sourceMappingURL=pricing.service.js.map