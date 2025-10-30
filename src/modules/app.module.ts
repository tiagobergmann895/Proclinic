import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../common/prisma.module';
import { InventoryModule } from './inventory/inventory.module';
import { CostingModule } from './costing/costing.module';
import { PricingModule } from './pricing/pricing.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { ItemsModule } from './items/items.module';
import { ProcedureTypesModule } from './procedure-types/procedure-types.module';
import { ProceduresModule } from './procedures/procedures.module';
import { ReportsModule } from './reports/reports.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    InventoryModule,
    CostingModule,
    PricingModule,
    AuthModule,
    PatientsModule,
    ItemsModule,
    ProcedureTypesModule,
    ProceduresModule,
    ReportsModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
