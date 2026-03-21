import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  create(createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({ data: createTransactionDto });
  }

  findAll() {
    return this.prisma.transaction.findMany({ include: { invoice: true }, orderBy: { date: 'desc' } });
  }

  async findOne(id: string) {
    const record = await this.prisma.transaction.findUnique({ where: { id }, include: { invoice: true } });
    if (!record) throw new NotFoundException('Transaction not found');
    return record;
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.transaction.update({ where: { id }, data: updateTransactionDto });
  }

  remove(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
