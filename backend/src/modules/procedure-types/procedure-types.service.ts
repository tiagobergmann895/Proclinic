import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ProcedureTypesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.procedureType.findMany({ orderBy: { name: 'asc' } });
  }

  create(data: any) {
    return this.prisma.procedureType.create({ data });
  }

  get(id: string) {
    return this.prisma.procedureType.findUnique({ where: { id } });
  }

  update(id: string, data: any) {
    return this.prisma.procedureType.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.procedureType.delete({ where: { id } });
  }
}














