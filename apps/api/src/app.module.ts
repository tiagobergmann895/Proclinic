import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ClinicalRecordModule } from './clinical-record/clinical-record.module';
import { InvoiceModule } from './invoice/invoice.module';
import { TransactionModule } from './transaction/transaction.module';
import { ProductModule } from './product/product.module';
import { StockMovementModule } from './stock-movement/stock-movement.module';
import { BiModule } from './bi/bi.module';
import { SadtGuideModule } from './sadt-guide/sadt-guide.module';
import { ProfessionalModule } from './professional/professional.module';

@Module({
  imports: [AuthModule, PrismaModule, PatientModule, AppointmentModule, ClinicalRecordModule, InvoiceModule, TransactionModule, ProductModule, StockMovementModule, BiModule, SadtGuideModule, ProfessionalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


