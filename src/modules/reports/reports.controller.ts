import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ReportsService } from './reports.service';
import { ProfitabilityQueryDto, DateRangeQueryDto } from './dto/reports.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('profitability')
  @Roles('financeiro', 'gestor')
  @ApiOperation({ summary: 'Relatório de rentabilidade por período' })
  profitability(@Query() query: ProfitabilityQueryDto) {
    return this.service.profitability(query.from, query.to, query.groupBy);
  }

  @Get('stock-alerts')
  @Roles('gestor', 'financeiro')
  @ApiOperation({ summary: 'Alertas de estoque baixo e itens próximos ao vencimento' })
  stockAlerts() {
    return this.service.stockAlerts();
  }

  @Get('revenue')
  @Roles('financeiro', 'gestor')
  @ApiOperation({ summary: 'Receita total por período' })
  revenue(@Query() query: DateRangeQueryDto) {
    return this.service.getTotalRevenue(query.from, query.to);
  }

  @Get('procedures-summary')
  @Roles('gestor', 'financeiro')
  @ApiOperation({ summary: 'Resumo de procedimentos realizados' })
  proceduresSummary(@Query() query: DateRangeQueryDto) {
    return this.service.getProceduresSummary(query.from, query.to);
  }

  @Get('top-procedures')
  @Roles('gestor', 'financeiro')
  @ApiOperation({ summary: 'Procedimentos mais realizados' })
  topProcedures(@Query() query: DateRangeQueryDto) {
    return this.service.getTopProcedures(query.from, query.to);
  }

  @Get('inventory-value')
  @Roles('gestor', 'financeiro')
  @ApiOperation({ summary: 'Valor total do inventário' })
  inventoryValue() {
    return this.service.getInventoryValue();
  }
}







