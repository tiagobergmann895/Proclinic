import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockMovementService {
  constructor(private prisma: PrismaService) {}

  async create(createStockMovementDto: CreateStockMovementDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const movement = await prisma.stockMovement.create({ data: createStockMovementDto });
      
      const amount = createStockMovementDto.type === 'IN' 
        ? createStockMovementDto.quantity 
        : -createStockMovementDto.quantity;
        
      await prisma.product.update({
        where: { id: createStockMovementDto.productId },
        data: { currentStock: { increment: amount } }
      });
      
      return movement;
    });
  }

  findAll() {
    return this.prisma.stockMovement.findMany({ include: { product: true }, orderBy: { date: 'desc' } });
  }

  async findOne(id: string) {
    const record = await this.prisma.stockMovement.findUnique({ where: { id }, include: { product: true } });
    if (!record) throw new NotFoundException('StockMovement not found');
    return record;
  }

  update(id: string, updateStockMovementDto: UpdateStockMovementDto) {
    return this.prisma.stockMovement.update({ where: { id }, data: updateStockMovementDto });
  }

  remove(id: string) {
    return this.prisma.stockMovement.delete({ where: { id } });
  }
}
