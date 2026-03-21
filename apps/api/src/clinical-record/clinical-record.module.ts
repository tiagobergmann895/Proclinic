import { Module } from '@nestjs/common';
import { ClinicalRecordService } from './clinical-record.service';
import { ClinicalRecordController } from './clinical-record.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicalRecordController],
  providers: [ClinicalRecordService],
})
export class ClinicalRecordModule {}
