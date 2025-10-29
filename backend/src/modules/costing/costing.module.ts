import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CostingService } from './costing.service';

@Module({
  imports: [PrismaModule, InventoryModule],
  providers: [CostingService],
  exports: [CostingService],
})
export class CostingModule {}














