import { Module } from '@nestjs/common';
import { SadtGuideService } from './sadt-guide.service';
import { SadtGuideController } from './sadt-guide.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SadtGuideController],
  providers: [SadtGuideService],
})
export class SadtGuideModule {}
