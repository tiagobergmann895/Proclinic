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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let PatientsService = class PatientsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(query) {
        var _a, _b;
        const where = query.q
            ? {
                OR: [
                    { name: { contains: query.q, mode: 'insensitive' } },
                    { document: { contains: query.q } },
                    { phone: { contains: query.q } },
                ],
            }
            : {};
        const take = (_a = query.pageSize) !== null && _a !== void 0 ? _a : 20;
        const skip = (((_b = query.page) !== null && _b !== void 0 ? _b : 1) - 1) * take;
        return this.prisma.patient.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } });
    }
    create(data) {
        return this.prisma.patient.create({ data });
    }
    get(id) {
        return this.prisma.patient.findUnique({ where: { id } });
    }
    update(id, data) {
        return this.prisma.patient.update({ where: { id }, data });
    }
    remove(id) {
        return this.prisma.patient.delete({ where: { id } });
    }
    async history(id) {
        const procedures = await this.prisma.procedure.findMany({ where: { patientId: id }, include: { costSheet: true, payments: true } });
        return { procedures };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map