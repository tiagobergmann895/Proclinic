import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}














