import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CostingModule } from '../costing/costing.module';
import { PricingModule } from '../pricing/pricing.module';
import { ProceduresService } from './procedures.service';

@Module({
  imports: [PrismaModule, InventoryModule, CostingModule, PricingModule],
  providers: [ProceduresService],
  exports: [ProceduresService],
})
export class ProceduresModule {}














