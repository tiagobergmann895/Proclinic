import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma.module';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';

@Module({
  imports: [PrismaModule],
  providers: [ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule {}














