import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  tenantId: string;

  @IsString()
  @IsOptional()
  invoiceId?: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}
