import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma.module';
import { PricingService } from './pricing.service';

@Module({
  imports: [PrismaModule],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}














