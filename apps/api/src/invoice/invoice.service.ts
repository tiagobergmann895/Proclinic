import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    return this.prisma.invoice.create({ data: createInvoiceDto });
  }

  findAll() {
    return this.prisma.invoice.findMany({ include: { patient: true }, orderBy: { dueDate: 'desc' } });
  }

  async findOne(id: string) {
    const record = await this.prisma.invoice.findUnique({ where: { id }, include: { patient: true } });
    if (!record) throw new NotFoundException('Invoice not found');
    return record;
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.prisma.invoice.update({ where: { id }, data: updateInvoiceDto });
  }

  remove(id: string) {
    return this.prisma.invoice.delete({ where: { id } });
  }
}
