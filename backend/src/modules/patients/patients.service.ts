import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  list(query: { q?: string; page?: number; pageSize?: number }) {
    const where: any = query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: 'insensitive' } },
            { document: { contains: query.q } },
            { phone: { contains: query.q } },
          ],
        }
      : {};
    const take = query.pageSize ?? 20;
    const skip = ((query.page ?? 1) - 1) * take;
    return this.prisma.patient.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } });
  }

  create(data: any) {
    return this.prisma.patient.create({ data });
  }

  get(id: string) {
    return this.prisma.patient.findUnique({ where: { id } });
  }

  update(id: string, data: any) {
    return this.prisma.patient.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.patient.delete({ where: { id } });
  }

  async getPatientSummary(patientId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        appointments: {
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!patient) {
      return null;
    }

    return patient;
  }
}












