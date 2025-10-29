import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma.module';
import { ProcedureTypesController } from './procedure-types.controller';
import { ProcedureTypesService } from './procedure-types.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProcedureTypesController],
  providers: [ProcedureTypesService],
})
export class ProcedureTypesModule {}














