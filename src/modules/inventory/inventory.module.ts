import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma.module';
import { InventoryService } from './inventory.service';

@Module({
  imports: [PrismaModule],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}














