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
exports.ListItemsQueryDto = exports.CreateBatchDto = exports.UpdateItemDto = exports.CreateItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateItemDto {
}
exports.CreateItemDto = CreateItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Seringa 5ml' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Material Cirúrgico', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'unidade' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SYR-5ML-001', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "minStock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateItemDto.prototype, "isControlled", void 0);
class UpdateItemDto {
}
exports.UpdateItemDto = UpdateItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Seringa 5ml', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Material Cirúrgico', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'unidade', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SYR-5ML-001', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateItemDto.prototype, "minStock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateItemDto.prototype, "isControlled", void 0);
class CreateBatchDto {
}
exports.CreateBatchDto = CreateBatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'LOTE001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBatchDto.prototype, "batchCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-31', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBatchDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2.50 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBatchDto.prototype, "unitCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBatchDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-id-here' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBatchDto.prototype, "performedByUserId", void 0);
class ListItemsQueryDto {
    constructor() {
        this.page = 1;
        this.pageSize = 20;
    }
}
exports.ListItemsQueryDto = ListItemsQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Termo de busca' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListItemsQueryDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filtrar por categoria' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListItemsQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1, description: 'Número da página' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ListItemsQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 20, description: 'Itens por página' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ListItemsQueryDto.prototype, "pageSize", void 0);
//# sourceMappingURL=item.dto.js.map