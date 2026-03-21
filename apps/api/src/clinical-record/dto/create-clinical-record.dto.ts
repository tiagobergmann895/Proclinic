import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateClinicalRecordDto {
  @IsString()
  tenantId: string;

  @IsString()
  patientId: string;

  @IsString()
  professionalId: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  signed?: boolean;
}
