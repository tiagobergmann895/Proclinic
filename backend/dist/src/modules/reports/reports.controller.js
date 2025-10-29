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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const reports_service_1 = require("./reports.service");
const reports_dto_1 = require("./dto/reports.dto");
let ReportsController = class ReportsController {
    constructor(service) {
        this.service = service;
    }
    profitability(query) {
        return this.service.profitability(query.from, query.to, query.groupBy);
    }
    stockAlerts() {
        return this.service.stockAlerts();
    }
    revenue(query) {
        return this.service.getTotalRevenue(query.from, query.to);
    }
    proceduresSummary(query) {
        return this.service.getProceduresSummary(query.from, query.to);
    }
    topProcedures(query) {
        return this.service.getTopProcedures(query.from, query.to);
    }
    inventoryValue() {
        return this.service.getInventoryValue();
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('profitability'),
    (0, roles_decorator_1.Roles)('financeiro', 'gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Relatório de rentabilidade por período' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.ProfitabilityQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "profitability", null);
__decorate([
    (0, common_1.Get)('stock-alerts'),
    (0, roles_decorator_1.Roles)('gestor', 'financeiro'),
    (0, swagger_1.ApiOperation)({ summary: 'Alertas de estoque baixo e itens próximos ao vencimento' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "stockAlerts", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, roles_decorator_1.Roles)('financeiro', 'gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Receita total por período' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "revenue", null);
__decorate([
    (0, common_1.Get)('procedures-summary'),
    (0, roles_decorator_1.Roles)('gestor', 'financeiro'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumo de procedimentos realizados' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "proceduresSummary", null);
__decorate([
    (0, common_1.Get)('top-procedures'),
    (0, roles_decorator_1.Roles)('gestor', 'financeiro'),
    (0, swagger_1.ApiOperation)({ summary: 'Procedimentos mais realizados' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reports_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "topProcedures", null);
__decorate([
    (0, common_1.Get)('inventory-value'),
    (0, roles_decorator_1.Roles)('gestor', 'financeiro'),
    (0, swagger_1.ApiOperation)({ summary: 'Valor total do inventário' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "inventoryValue", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map