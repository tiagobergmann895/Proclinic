import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreatePatientDto, UpdatePatientDto, ListPatientsQueryDto } from './dto/patient.dto';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly service: PatientsService) {}

  @Get()
  @Roles('recepcao', 'gestor')
  @ApiOperation({ summary: 'Listar pacientes' })
  list(@Query() query: ListPatientsQueryDto) {
    return this.service.list(query);
  }

  @Post()
  @Roles('recepcao', 'gestor')
  @ApiOperation({ summary: 'Criar novo paciente' })
  create(@Body() body: CreatePatientDto) {
    return this.service.create(body);
  }

  @Get(':id')
  @Roles('recepcao', 'gestor')
  @ApiOperation({ summary: 'Buscar paciente por ID' })
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Put(':id')
  @Roles('recepcao', 'gestor')
  @ApiOperation({ summary: 'Atualizar paciente' })
  update(@Param('id') id: string, @Body() body: UpdatePatientDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @Roles('gestor')
  @ApiOperation({ summary: 'Remover paciente' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get(':id/history')
  @Roles('recepcao', 'gestor')
  @ApiOperation({ summary: 'Histórico de procedimentos do paciente' })
  history(@Param('id') id: string) {
    return this.service.history(id);
  }
}



