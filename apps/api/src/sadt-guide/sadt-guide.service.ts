import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSadtGuideDto } from './dto/create-sadt-guide.dto';
import { UpdateSadtGuideDto } from './dto/update-sadt-guide.dto';

@Injectable()
export class SadtGuideService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSadtGuideDto) {
    // Find tenantId from patient
    const patient = await this.prisma.patient.findUnique({ where: { id: dto.patientId } });
    const tenantId = patient?.tenantId || '';
    return this.prisma.sadtGuide.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        professionalId: dto.professionalId,
        insurerName: dto.insurerName || 'Particular',
        insurerCard: dto.insurerCard,
        cid10: dto.cid10,
        clinicalIndication: dto.clinicalIndication,
        procedures: (dto.procedures as any) || [],
        observations: dto.observations,
      },
      include: { patient: true, professional: true },
    });
  }

  async findAll(patientId?: string) {
    return this.prisma.sadtGuide.findMany({
      where: patientId ? { patientId } : {},
      include: { patient: true, professional: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.sadtGuide.findUnique({
      where: { id },
      include: { patient: true, professional: true },
    });
  }

  async update(id: string, dto: UpdateSadtGuideDto) {
    return this.prisma.sadtGuide.update({
      where: { id },
      data: {
        ...(dto.insurerName && { insurerName: dto.insurerName }),
        ...(dto.insurerCard !== undefined && { insurerCard: dto.insurerCard }),
        ...(dto.cid10 !== undefined && { cid10: dto.cid10 }),
        ...(dto.clinicalIndication !== undefined && { clinicalIndication: dto.clinicalIndication }),
        ...(dto.procedures && { procedures: dto.procedures as any }),
        ...(dto.observations !== undefined && { observations: dto.observations }),
        ...(dto.status && { status: dto.status }),
      },
      include: { patient: true, professional: true },
    });
  }

  async remove(id: string) {
    return this.prisma.sadtGuide.delete({ where: { id } });
  }
}
