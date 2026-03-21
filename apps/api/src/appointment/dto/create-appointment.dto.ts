import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  tenantId: string;

  @IsString()
  patientId: string;

  @IsString()
  professionalId: string;

  @IsDateString()
  date: string;

  @IsInt()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
