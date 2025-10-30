import { Module } from '@nestjs/common';
import { EhrController } from './ehr.controller';
import { EhrService } from './ehr.service';
import { AuditService } from './audit.service';
import { PrismaModule } from '../../common/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EhrController],
  providers: [EhrService, AuditService],
  exports: [EhrService, AuditService],
})
export class EhrModule {}




