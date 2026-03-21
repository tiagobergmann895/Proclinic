import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BiService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    const totalPatients = await this.prisma.patient.count();
    
    const paidInvoices = await this.prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true }
    });
    const totalRevenue = paidInvoices._sum.amount || 0;

    const pendingInvoices = await this.prisma.invoice.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true }
    });
    const totalReceivable = pendingInvoices._sum.amount || 0;

    const totalAppointments = await this.prisma.appointment.count();
    const totalProfessionals = await this.prisma.professional.count();

    const avgTicket = totalPatients > 0 ? (totalRevenue / totalPatients) : 0;

    return {
      totalPatients,
      totalRevenue,
      totalReceivable,
      avgTicket,
      totalAppointments,
      totalProfessionals
    };
  }
}
