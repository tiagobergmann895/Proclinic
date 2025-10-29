"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProceduresModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../common/prisma.module");
const inventory_module_1 = require("../inventory/inventory.module");
const costing_module_1 = require("../costing/costing.module");
const pricing_module_1 = require("../pricing/pricing.module");
const procedures_service_1 = require("./procedures.service");
let ProceduresModule = class ProceduresModule {
};
exports.ProceduresModule = ProceduresModule;
exports.ProceduresModule = ProceduresModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, inventory_module_1.InventoryModule, costing_module_1.CostingModule, pricing_module_1.PricingModule],
        providers: [procedures_service_1.ProceduresService],
        exports: [procedures_service_1.ProceduresService],
    })
], ProceduresModule);
//# sourceMappingURL=procedures.module.js.map