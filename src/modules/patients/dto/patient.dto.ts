import { IsString, IsOptional, IsDateString, IsEmail, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  name: string = '';

  @ApiProperty({ example: '1990-05-15', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ example: '123.456.789-00', required: false })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({ example: '(11) 99999-9999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'maria@email.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Rua das Flores, 123', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Paciente alérgica a penicilina', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePatientDto {
  @ApiProperty({ example: 'Maria Silva Santos', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '1990-05-15', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ example: '123.456.789-00', required: false })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({ example: '(11) 99999-9999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'maria@email.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Rua das Flores, 123', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Paciente alérgica a penicilina', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ListPatientsQueryDto {
  @ApiProperty({ required: false, description: 'Termo de busca' })
  @IsOptional()
  @IsString()
  q?: string;

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
