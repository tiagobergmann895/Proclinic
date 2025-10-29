import { IsString, IsOptional, IsDateString, IsEnum, IsArray, IsInt, Min, Max, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProcedureStatus } from '@prisma/client';

export class CreateProcedureDto {
  @ApiProperty({ example: 'patient-id-here' })
  @IsString()
  patientId!: string;

  @ApiProperty({ example: 'professional-user-id' })
  @IsString()
  professionalUserId!: string;

  @ApiProperty({ example: 'procedure-type-id' })
  @IsString()
  procedureTypeId!: string;

  @ApiProperty({ example: '2024-12-25T10:00:00Z' })
  @IsDateString()
  scheduledAt!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateProcedureDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  professionalUserId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  procedureTypeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({ required: false, enum: ProcedureStatus })
  @IsOptional()
  @IsEnum(ProcedureStatus)
  status?: ProcedureStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ListProceduresQueryDto {
  @ApiProperty({ required: false, description: 'Filtrar por paciente' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({ required: false, description: 'Filtrar por profissional' })
  @IsOptional()
  @IsString()
  professionalUserId?: string;

  @ApiProperty({ required: false, description: 'Filtrar por tipo' })
  @IsOptional()
  @IsString()
  procedureTypeId?: string;

  @ApiProperty({ required: false, enum: ProcedureStatus, description: 'Filtrar por status' })
  @IsOptional()
  @IsEnum(ProcedureStatus)
  status?: ProcedureStatus;

  @ApiProperty({ required: false, description: 'Data de início' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({ required: false, description: 'Data de fim' })
  @IsOptional()
  @IsDateString()
  to?: string;

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

export class ItemUsageDto {
  @ApiProperty({ example: 'item-id' })
  @IsString()
  itemId!: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class FinishProcedureDto {
  @ApiProperty({ type: [ItemUsageDto], description: 'Itens consumidos no procedimento' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemUsageDto)
  itemsUsed!: ItemUsageDto[];

  @ApiProperty({ example: 'user-id-here', description: 'ID do usuário que finalizou' })
  @IsString()
  performedByUserId!: string;
}




