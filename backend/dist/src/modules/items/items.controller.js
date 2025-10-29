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
exports.ItemsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const items_service_1 = require("./items.service");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const item_dto_1 = require("./dto/item.dto");
let ItemsController = class ItemsController {
    constructor(service) {
        this.service = service;
    }
    list(query) {
        return this.service.list();
    }
    create(body) {
        return this.service.create(body);
    }
    get(id) {
        return this.service.get(id);
    }
    update(id, body) {
        return this.service.update(id, body);
    }
    remove(id) {
        return this.service.remove(id);
    }
    createBatch(itemId, body) {
        const expirationDate = body.expirationDate ? new Date(body.expirationDate) : undefined;
        return this.service.createBatch(itemId, { batchCode: body.batchCode, expirationDate, unitCost: body.unitCost, quantity: body.quantity }, body.performedByUserId);
    }
};
exports.ItemsController = ItemsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('gestor', 'financeiro'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar itens' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_dto_1.ListItemsQueryDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo item' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_dto_1.CreateItemDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('gestor', 'financeiro'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar item por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar item' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, item_dto_1.UpdateItemDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover item' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/batches'),
    (0, roles_decorator_1.Roles)('gestor'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar lote de item' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, item_dto_1.CreateBatchDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "createBatch", null);
exports.ItemsController = ItemsController = __decorate([
    (0, swagger_1.ApiTags)('Items'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('items'),
    __metadata("design:paramtypes", [items_service_1.ItemsService])
], ItemsController);
//# sourceMappingURL=items.controller.js.map