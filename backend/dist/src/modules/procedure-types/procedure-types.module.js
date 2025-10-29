"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcedureTypesModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../common/prisma.module");
const procedure_types_controller_1 = require("./procedure-types.controller");
const procedure_types_service_1 = require("./procedure-types.service");
let ProcedureTypesModule = class ProcedureTypesModule {
};
exports.ProcedureTypesModule = ProcedureTypesModule;
exports.ProcedureTypesModule = ProcedureTypesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [procedure_types_controller_1.ProcedureTypesController],
        providers: [procedure_types_service_1.ProcedureTypesService],
    })
], ProcedureTypesModule);
//# sourceMappingURL=procedure-types.module.js.map