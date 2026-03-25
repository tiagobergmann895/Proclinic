import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateSadtGuideDto {
  @IsString()
  patientId: string;

  @IsString()
  professionalId: string;

  @IsString()
  @IsOptional()
  insurerName?: string;

  @IsString()
  @IsOptional()
  insurerCard?: string;

  @IsString()
  @IsOptional()
  cid10?: string;

  @IsString()
  @IsOptional()
  clinicalIndication?: string;

  @IsArray()
  @IsOptional()
  procedures?: { code: string; description: string; quantity: number }[];

  @IsString()
  @IsOptional()
  observations?: string;
}
