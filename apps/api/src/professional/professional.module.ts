import { Module } from '@nestjs/common';
import { ProfessionalController } from './professional.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProfessionalController],
})
export class ProfessionalModule {}
