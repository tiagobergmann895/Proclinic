import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export enum GroupByOption {
  PROCEDURE_TYPE = 'procedureType',
  PROFESSIONAL = 'professional',
}

export class ProfitabilityQueryDto {
  @ApiProperty({ required: false, description: 'Data de início (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({ required: false, description: 'Data de fim (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiProperty({ required: false, enum: GroupByOption, description: 'Agrupar por tipo de procedimento ou profissional' })
  @IsOptional()
  @IsEnum(GroupByOption)
  groupBy?: GroupByOption;
}

export class DateRangeQueryDto {
  @ApiProperty({ required: false, description: 'Data de início (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({ required: false, description: 'Data de fim (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  to?: string;
}




