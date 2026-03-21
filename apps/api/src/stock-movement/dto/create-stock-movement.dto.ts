import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateStockMovementDto {
  @IsString()
  tenantId: string;

  @IsString()
  productId: string;

  @IsString()
  type: string; // IN, OUT

  @IsNumber()
  quantity: number;

  @IsString()
  reason: string; // PURCHASE, USAGE, EXPIRATION, ADJUSTMENT

  @IsString()
  @IsOptional()
  batchNumber?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;
}
