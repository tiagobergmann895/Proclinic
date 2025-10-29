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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EhrController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const ehr_service_1 = require("./ehr.service");
const ehr_dto_1 = require("./dto/ehr.dto");
let EhrController = class EhrController {
    constructor(service) {
        this.service = service;
    }
    getTimeline(patientId, query, req) {
        return this.service.getPatientTimeline(patientId, req.user.userId, req.user.tenantId, {
            from: query.from ? new Date(query.from) : undefined,
            to: query.to ? new Date(query.to) : undefined,
            types: query.types,
            page: query.page,
            pageSize: query.pageSize,
        });
    }
    createSoapNote(dto, req) {
        return this.service.createSoapNote(dto, req.user.userId, req.user.tenantId);
    }
    signNote(dto, req) {
        return this.service.signClinicalNote(dto.noteId, req.user.userId, req.user.tenantId);
    }
    recordVitalSigns(dto, req) {
        return this.service.recordVitalSigns(dto, req.user.userId, req.user.tenantId);
    }
    getVitalSigns(patientId, code, from, to, req) {
        return { message: 'Get vital signs - to implement' };
    }
    createPrescription(dto, req) {
        return this.service.createPrescription(dto, req.user.userId, req.user.tenantId);
    }
    signPrescription(id, req) {
        return this.service.signPrescription(id, req.user.userId, req.user.tenantId);
    }
    createAllergy(dto, req) {
        return { message: 'Create allergy - to implement' };
    }
    getAllergies(patientId, req) {
        return { message: 'Get allergies - to implement' };
    }
    createCondition(dto, req) {
        return { message: 'Create condition - to implement' };
    }
    getConditions(patientId, status, req) {
        return { message: 'Get conditions - to implement' };
    }
    createImmunization(dto, req) {
        return { message: 'Create immunization - to implement' };
    }
    getImmunizations(patientId, req) {
        return { message: 'Get immunizations - to implement' };
    }
    uploadDocument(file, dto, req) {
        return this.service.uploadDocument({
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
        }, dto, req.user.userId, req.user.tenantId);
    }
    downloadDocument(id, req) {
        return this.service.getPresignedDownloadUrl(id, req.user.userId, req.user.tenantId);
    }
    exportFhir(patientId, req) {
        return this.service.exportPatientBundle(patientId, req.user.userId, req.user.tenantId);
    }
    createEncounter(dto, req) {
        return { message: 'Create encounter - to implement' };
    }
    startEncounter(id, req) {
        return { message: 'Start encounter - to implement' };
    }
    finishEncounter(id, req) {
        return { message: 'Finish encounter - to implement' };
    }
    breakTheGlass(dto, req) {
        return this.service.breakTheGlass(req.user.userId, req.user.tenantId, dto.resourceType, dto.resourceId, dto.justification);
    }
};
exports.EhrController = EhrController;
__decorate([
    (0, common_1.Get)('patients/:patientId/timeline'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'ADMIN_CLINICA', 'AUDITOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Timeline completa do paciente' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ehr_dto_1.TimelineQueryDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Post)('notes/soap'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar evolução SOAP' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ehr_dto_1.CreateSoapNoteDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "createSoapNote", null);
__decorate([
    (0, common_1.Post)('notes/sign'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO'),
    (0, swagger_1.ApiOperation)({ summary: 'Assinar nota clínica' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ehr_dto_1.SignNoteDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "signNote", null);
__decorate([
    (0, common_1.Post)('observations/vital-signs'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar sinais vitais' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ehr_dto_1.RecordVitalSignsDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "recordVitalSigns", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/vital-signs'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'ADMIN_CLINICA'),
    (0, swagger_1.ApiOperation)({ summary: 'Histórico de sinais vitais' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('code')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "getVitalSigns", null);
__decorate([
    (0, common_1.Post)('prescriptions'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar prescrição' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ehr_dto_1.CreatePrescriptionDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Post)('prescriptions/:id/sign'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA'),
    (0, swagger_1.ApiOperation)({ summary: 'Assinar prescrição' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "signPrescription", null);
__decorate([
    (0, common_1.Post)('allergies'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'ENFERMEIRO'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar alergia' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ehr_dto_1.CreateAllergyDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "createAllergy", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/allergies'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar alergias do paciente' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "getAllergies", null);
__decorate([
    (0, common_1.Post)('conditions'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar diagnóstico/problema' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ehr_dto_1.CreateConditionDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "createCondition", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/conditions'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar problemas ativos' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "getConditions", null);
__decorate([
    (0, common_1.Post)('immunizations'),
    (0, roles_decorator_1.Roles)('MEDICO', 'ENFERMEIRO'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar vacinação' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ehr_dto_1.CreateImmunizationDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "createImmunization", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/immunizations'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO'),
    (0, swagger_1.ApiOperation)({ summary: 'Cartão de vacinas' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "getImmunizations", null);
__decorate([
    (0, common_1.Post)('documents/upload'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload de documento' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, ehr_dto_1.UploadDocumentDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('documents/:id/download'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO', 'ADMIN_CLINICA'),
    (0, swagger_1.ApiOperation)({ summary: 'Download de documento (presigned URL)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "downloadDocument", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/export/fhir'),
    (0, roles_decorator_1.Roles)('MEDICO', 'ADMIN_CLINICA', 'AUDITOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Exportar prontuário em FHIR Bundle' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "exportFhir", null);
__decorate([
    (0, common_1.Post)('encounters'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO', 'RECEPCAO'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar consulta/atendimento' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ehr_dto_1.CreateEncounterDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "createEncounter", null);
__decorate([
    (0, common_1.Post)('encounters/:id/start'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO'),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar atendimento' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "startEncounter", null);
__decorate([
    (0, common_1.Post)('encounters/:id/finish'),
    (0, roles_decorator_1.Roles)('MEDICO', 'DENTISTA', 'PSICOLOGO', 'ENFERMEIRO'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalizar atendimento' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "finishEncounter", null);
__decorate([
    (0, common_1.Post)('break-the-glass'),
    (0, roles_decorator_1.Roles)('MEDICO', 'ENFERMEIRO'),
    (0, swagger_1.ApiOperation)({
        summary: 'Acesso de emergência com justificativa',
        description: 'Permite acesso temporário a prontuários restritos em situações de emergência. Requer justificativa detalhada e gera auditoria reforçada.'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ehr_dto_1.BreakTheGlassDto, Object]),
    __metadata("design:returntype", void 0)
], EhrController.prototype, "breakTheGlass", null);
exports.EhrController = EhrController = __decorate([
    (0, swagger_1.ApiTags)('EHR - Prontuário Eletrônico'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('ehr'),
    __metadata("design:paramtypes", [ehr_service_1.EhrService])
], EhrController);
//# sourceMappingURL=ehr.controller.js.map