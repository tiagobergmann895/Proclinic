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
exports.ProceduresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const prisma_service_1 = require("../../common/prisma.service");
const procedures_service_1 = require("./procedures.service");
const procedure_dto_1 = require("./dto/procedure.dto");
let ProceduresController = class ProceduresController {
    constructor(prisma, service) {
        this.prisma = prisma;
        this.service = service;
    }
    list(query) {
        const where = {};
        if (query.professionalUserId)
            where.professionalUserId = query.professionalUserId;
        if (query.patientId)
            where.patientId = query.patientId;
        if (query.procedureTypeId)
            where.procedureTypeId = query.procedureTypeId;
        if (query.status)
            where.status = query.status;
        if (query.from || query.to) {
            where.scheduledAt = {
                gte: query.from ? new Date(query.from) : undefined,
                lte: query.to ? new Date(query.to) : undefined
            };
        }
        return this.prisma.procedure.findMany({
            where,
            orderBy: { scheduledAt: 'asc' },
            take: query.pageSize,
            skip: (query.page - 1) * query.pageSize
        });
    }
    create(body) {
        return this.prisma.procedure.create({ data: body });
    }
    get(id) {
        return this.prisma.procedure.findUnique({
            where: { id },
            include: {
                patient: true,
                professional: true,
                procedureType: true,
                costSheet: true
            }
        });
    }
    update(id, body) {
        return this.prisma.procedure.update({ where: { id }, data: body });
    }
    start(id) {
        return this.prisma.procedure.update({ where: { id }, data: { startedAt: new Date() } });
    }
    finish(id, body) {
        return this.service.finishProcedure({
            procedureId: id,
            itemsOverride: body.itemsUsed,
            performedByUserId: body.performedByUserId
        });
    }
};
exports.ProceduresController = ProceduresController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('recepcao', 'profissional', 'gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar procedimentos' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [procedure_dto_1.ListProceduresQueryDto]),
    __metadata("design:returntype", void 0)
], ProceduresController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('recepcao', 'gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo procedimento' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [procedure_dto_1.CreateProcedureDto]),
    __metadata("design:returntype", void 0)
], ProceduresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('recepcao', 'profissional', 'gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar procedimento por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProceduresController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('recepcao', 'gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar procedimento' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, procedure_dto_1.UpdateProcedureDto]),
    __metadata("design:returntype", void 0)
], ProceduresController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, roles_decorator_1.Roles)('profissional', 'gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar procedimento' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProceduresController.prototype, "start", null);
__decorate([
    (0, common_1.Post)(':id/finish'),
    (0, roles_decorator_1.Roles)('profissional', 'gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalizar procedimento' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, procedure_dto_1.FinishProcedureDto]),
    __metadata("design:returntype", void 0)
], ProceduresController.prototype, "finish", null);
exports.ProceduresController = ProceduresController = __decorate([
    (0, swagger_1.ApiTags)('Procedures'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('procedures'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, procedures_service_1.ProceduresService])
], ProceduresController);
//# sourceMappingURL=procedures.controller.js.map