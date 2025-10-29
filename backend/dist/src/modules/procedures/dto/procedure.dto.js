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
exports.FinishProcedureDto = exports.ItemUsageDto = exports.ListProceduresQueryDto = exports.UpdateProcedureDto = exports.CreateProcedureDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateProcedureDto {
}
exports.CreateProcedureDto = CreateProcedureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-id-here' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcedureDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'professional-user-id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcedureDto.prototype, "professionalUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'procedure-type-id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcedureDto.prototype, "procedureTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-25T10:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateProcedureDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProcedureDto.prototype, "notes", void 0);
class UpdateProcedureDto {
}
exports.UpdateProcedureDto = UpdateProcedureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProcedureDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProcedureDto.prototype, "professionalUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProcedureDto.prototype, "procedureTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateProcedureDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.ProcedureStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ProcedureStatus),
    __metadata("design:type", String)
], UpdateProcedureDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProcedureDto.prototype, "notes", void 0);
class ListProceduresQueryDto {
    constructor() {
        this.page = 1;
        this.pageSize = 20;
    }
}
exports.ListProceduresQueryDto = ListProceduresQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filtrar por paciente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListProceduresQueryDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filtrar por profissional' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListProceduresQueryDto.prototype, "professionalUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filtrar por tipo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListProceduresQueryDto.prototype, "procedureTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.ProcedureStatus, description: 'Filtrar por status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ProcedureStatus),
    __metadata("design:type", String)
], ListProceduresQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Data de início' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ListProceduresQueryDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Data de fim' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ListProceduresQueryDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1, description: 'Número da página' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ListProceduresQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20, description: 'Itens por página' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ListProceduresQueryDto.prototype, "pageSize", void 0);
class ItemUsageDto {
}
exports.ItemUsageDto = ItemUsageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'item-id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItemUsageDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ItemUsageDto.prototype, "quantity", void 0);
class FinishProcedureDto {
}
exports.FinishProcedureDto = FinishProcedureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ItemUsageDto], description: 'Itens consumidos no procedimento' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ItemUsageDto),
    __metadata("design:type", Array)
], FinishProcedureDto.prototype, "itemsUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-id-here', description: 'ID do usuário que finalizou' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FinishProcedureDto.prototype, "performedByUserId", void 0);
//# sourceMappingURL=procedure.dto.js.map