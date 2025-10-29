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
exports.ProceduresService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../common/prisma.service");
const inventory_service_1 = require("../inventory/inventory.service");
const costing_service_1 = require("../costing/costing.service");
const pricing_service_1 = require("../pricing/pricing.service");
let ProceduresService = class ProceduresService {
    constructor(prisma, inventory, costing, pricing) {
        this.prisma = prisma;
        this.inventory = inventory;
        this.costing = costing;
        this.pricing = pricing;
    }
    async finishProcedure(params) {
        var _a, _b, _c, _d;
        const proc = await this.prisma.procedure.findUnique({
            where: { id: params.procedureId },
            include: { procedureType: true, patient: true, professional: true },
        });
        if (!proc)
            throw new common_1.BadRequestException('Procedimento não encontrado');
        if (!proc.patientId || !proc.professionalUserId) {
            throw new common_1.BadRequestException('Paciente e profissional obrigatórios');
        }
        const defaultItems = proc.procedureType.defaultItems || [];
        const resolvedDefault = await Promise.all(defaultItems.map(async (di) => {
            if (di.itemId)
                return di;
            if (!di.itemSku)
                return null;
            const item = await this.prisma.item.findFirst({ where: { sku: di.itemSku } });
            return item ? { itemId: item.id, quantity: di.quantity } : null;
        }));
        const baseItems = resolvedDefault.filter(Boolean);
        const itemsUsed = (_a = params.itemsOverride) !== null && _a !== void 0 ? _a : baseItems;
        for (const u of itemsUsed) {
            await this.inventory.consumeItem({
                itemId: u.itemId,
                quantity: u.quantity,
                procedureId: proc.id,
                performedByUserId: params.performedByUserId,
            });
        }
        const durationMin = (_b = params.actualDurationMin) !== null && _b !== void 0 ? _b : proc.procedureType.defaultDurationMin;
        const professionalHourlyCost = (_c = params.professionalHourlyCost) !== null && _c !== void 0 ? _c : 200;
        const overheadPerHour = Number((_d = process.env.OVERHEAD_RATE_PER_HOUR) !== null && _d !== void 0 ? _d : 100);
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
        await this.prisma.procedure.update({
            where: { id: proc.id },
            data: { status: client_1.ProcedureStatus.DONE, finishedAt: new Date() },
        });
        return sheet;
    }
};
exports.ProceduresService = ProceduresService;
exports.ProceduresService = ProceduresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inventory_service_1.InventoryService,
        costing_service_1.CostingService,
        pricing_service_1.PricingService])
], ProceduresService);
//# sourceMappingURL=procedures.service.js.map