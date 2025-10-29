import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateItemDto, UpdateItemDto, CreateBatchDto, ListItemsQueryDto } from './dto/item.dto';

@ApiTags('Items')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  @Get()
  @Roles('gestor', 'financeiro')
  @ApiOperation({ summary: 'Listar itens' })
  list(@Query() query: ListItemsQueryDto) {
    return this.service.list();
  }

  @Post()
  @Roles('gestor')
  @ApiOperation({ summary: 'Criar novo item' })
  create(@Body() body: CreateItemDto) {
    return this.service.create(body);
  }

  @Get(':id')
  @Roles('gestor', 'financeiro')
  @ApiOperation({ summary: 'Buscar item por ID' })
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Put(':id')
  @Roles('gestor')
  @ApiOperation({ summary: 'Atualizar item' })
  update(@Param('id') id: string, @Body() body: UpdateItemDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @Roles('gestor')
  @ApiOperation({ summary: 'Remover item' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/batches')
  @Roles('gestor')
  @ApiOperation({ summary: 'Criar lote de item' })
  createBatch(@Param('id') itemId: string, @Body() body: CreateBatchDto) {
    const expirationDate = body.expirationDate ? new Date(body.expirationDate) : undefined;
    return this.service.createBatch(itemId, { batchCode: body.batchCode, expirationDate, unitCost: body.unitCost, quantity: body.quantity }, body.performedByUserId);
  }
}







