import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
// import { EhrModule } from './modules/ehr/ehr.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PatientsModule,
    AppointmentsModule,
    SubscriptionsModule,
    // EhrModule,
  ],
})
export class AppModule {}