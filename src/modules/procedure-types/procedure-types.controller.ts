import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ProcedureTypesService } from './procedure-types.service';

@ApiTags('ProcedureTypes')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('procedure-types')
export class ProcedureTypesController {
  constructor(private readonly service: ProcedureTypesService) {}

  @Get()
  @Roles('gestor')
  list() { return this.service.list(); }

  @Post()
  @Roles('gestor')
  create(@Body() body: any) { return this.service.create(body); }

  @Get(':id')
  @Roles('gestor')
  get(@Param('id') id: string) { return this.service.get(id); }

  @Put(':id')
  @Roles('gestor')
  update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }

  @Delete(':id')
  @Roles('gestor')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}














