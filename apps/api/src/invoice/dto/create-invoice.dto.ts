import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  tenantId: string;

  @IsString()
  patientId: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  dueDate: string;
}
