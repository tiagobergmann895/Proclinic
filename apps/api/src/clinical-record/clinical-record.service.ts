import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from './dto/update-clinical-record.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClinicalRecordService {
  constructor(private prisma: PrismaService) {}

  create(createClinicalRecordDto: CreateClinicalRecordDto) {
    return this.prisma.clinicalRecord.create({
      data: createClinicalRecordDto,
    });
  }

  findAll() {
    return this.prisma.clinicalRecord.findMany({
      orderBy: { date: 'desc' },
      include: { patient: true }
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.clinicalRecord.findUnique({ where: { id }, include: { patient: true } });
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  update(id: string, updateClinicalRecordDto: UpdateClinicalRecordDto) {
    return this.prisma.clinicalRecord.update({
      where: { id },
      data: updateClinicalRecordDto,
    });
  }

  remove(id: string) {
    return this.prisma.clinicalRecord.delete({ where: { id } });
  }
}
