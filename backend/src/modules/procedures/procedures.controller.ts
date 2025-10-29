import { Body, Controller, Get, Param, Post, Query, UseGuards, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PrismaService } from '../../common/prisma.service';
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto, UpdateProcedureDto, ListProceduresQueryDto, FinishProcedureDto } from './dto/procedure.dto';

@ApiTags('Procedures')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('procedures')
export class ProceduresController {
  constructor(private readonly prisma: PrismaService, private readonly service: ProceduresService) {}

  @Get()
  @Roles('recepcao', 'profissional', 'gestor')
  @ApiOperation({ summary: 'Listar procedimentos' })
  list(@Query() query: ListProceduresQueryDto) {
    const where: any = {};
    if (query.professionalUserId) where.professionalUserId = query.professionalUserId;
    if (query.patientId) where.patientId = query.patientId;
    if (query.procedureTypeId) where.procedureTypeId = query.procedureTypeId;
    if (query.status) where.status = query.status;
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

  @Post()
  @Roles('recepcao', 'gestor')
  @ApiOperation({ summary: 'Criar novo procedimento' })
  create(@Body() body: CreateProcedureDto) { 
    return this.prisma.procedure.create({ data: body }); 
  }

  @Get(':id')
  @Roles('recepcao', 'profissional', 'gestor')
  @ApiOperation({ summary: 'Buscar procedimento por ID' })
  get(@Param('id') id: string) {
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

  @Put(':id')
  @Roles('recepcao', 'gestor')
  @ApiOperation({ summary: 'Atualizar procedimento' })
  update(@Param('id') id: string, @Body() body: UpdateProcedureDto) {
    return this.prisma.procedure.update({ where: { id }, data: body });
  }

  @Post(':id/start')
  @Roles('profissional', 'gestor')
  @ApiOperation({ summary: 'Iniciar procedimento' })
  start(@Param('id') id: string) { 
    return this.prisma.procedure.update({ where: { id }, data: { startedAt: new Date() } }); 
  }

  @Post(':id/finish')
  @Roles('profissional', 'gestor')
  @ApiOperation({ summary: 'Finalizar procedimento' })
  finish(@Param('id') id: string, @Body() body: FinishProcedureDto) {
    return this.service.finishProcedure({ 
      procedureId: id, 
      itemsOverride: body.itemsUsed, 
      performedByUserId: body.performedByUserId 
    });
  }
}







