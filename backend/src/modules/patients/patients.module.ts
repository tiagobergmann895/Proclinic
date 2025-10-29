import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma.module';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';

@Module({
  imports: [PrismaModule],
  providers: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}














