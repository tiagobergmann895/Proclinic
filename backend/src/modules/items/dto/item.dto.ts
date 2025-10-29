import { IsString, IsOptional, IsNumber, IsBoolean, Min, IsInt, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @ApiProperty({ example: 'Seringa 5ml' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Material Cirúrgico', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'unidade' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 'SYR-5ML-001', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 10, default: 0 })
  @IsNumber()
  @Min(0)
  minStock: number;

  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  isControlled: boolean;
}

export class UpdateItemDto {
  @ApiProperty({ example: 'Seringa 5ml', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Material Cirúrgico', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'unidade', required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ example: 'SYR-5ML-001', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isControlled?: boolean;
}

export class CreateBatchDto {
  @ApiProperty({ example: 'LOTE001' })
  @IsString()
  batchCode: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  @IsString()
  expirationDate?: string;

  @ApiProperty({ example: 2.50 })
  @IsNumber()
  @Min(0)
  unitCost: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 'user-id-here' })
  @IsString()
  performedByUserId: string;
}

export class ListItemsQueryDto {
  @ApiProperty({ required: false, description: 'Termo de busca' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, description: 'Filtrar por categoria' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, default: 1, description: 'Número da página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20, description: 'Itens por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
