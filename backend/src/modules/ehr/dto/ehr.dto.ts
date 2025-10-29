import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsDateString, 
  IsEnum, 
  IsNumber, 
  Min, 
  Max,
  IsInt,
  ValidateNested,
  MinLength,
  IsBoolean
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// ============================================================================
// CLINICAL NOTES / SOAP
// ============================================================================

export enum NoteTypeDto {
  SOAP = 'SOAP',
  PROGRESS = 'PROGRESS',
  ADMISSION = 'ADMISSION',
  DISCHARGE = 'DISCHARGE',
  CONSULT = 'CONSULT',
  PROCEDURE = 'PROCEDURE',
}

export class CreateSoapNoteDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'encounter-uuid', required: false })
  @IsOptional()
  @IsString()
  encounterId?: string;

  @ApiProperty({ example: 'Paciente relata dor de cabeça há 3 dias...' })
  @IsString()
  @MinLength(10)
  subjective: string;

  @ApiProperty({ example: 'PA: 120/80 mmHg, FC: 72 bpm, Tax: 36.5°C...' })
  @IsString()
  objective: string;

  @ApiProperty({ example: 'Cefaleia tensional. HAS controlada.' })
  @IsString()
  assessment: string;

  @ApiProperty({ example: 'Prescrito analgésico. Retorno em 7 dias.' })
  @IsString()
  plan: string;

  @ApiProperty({ required: false, example: 'Consulta de rotina' })
  @IsOptional()
  @IsString()
  title?: string;
}

export class SignNoteDto {
  @ApiProperty({ example: 'note-uuid' })
  @IsString()
  noteId: string;
}

// ============================================================================
// OBSERVATIONS / VITAL SIGNS
// ============================================================================

export class VitalSignDto {
  @ApiProperty({ example: '8310-5', description: 'LOINC code' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Temperatura corporal' })
  @IsString()
  display: string;

  @ApiProperty({ example: 36.5 })
  @IsNumber()
  value: number;

  @ApiProperty({ example: '°C' })
  @IsString()
  unit: string;
}

export class RecordVitalSignsDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'encounter-uuid', required: false })
  @IsOptional()
  @IsString()
  encounterId?: string;

  @ApiProperty({ type: [VitalSignDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VitalSignDto)
  vitalSigns: VitalSignDto[];
}

// ============================================================================
// PRESCRIPTIONS
// ============================================================================

export class PrescriptionItemDto {
  @ApiProperty({ example: 'Amoxicilina 500mg' })
  @IsString()
  medication: string;

  @ApiProperty({ example: '1 cápsula a cada 8 horas' })
  @IsString()
  dosage: string;

  @ApiProperty({ example: '7 dias' })
  @IsString()
  duration: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreatePrescriptionDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'encounter-uuid', required: false })
  @IsOptional()
  @IsString()
  encounterId?: string;

  @ApiProperty({ type: [PrescriptionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

// ============================================================================
// ALLERGIES
// ============================================================================

export enum AllergyCategoryDto {
  FOOD = 'FOOD',
  MEDICATION = 'MEDICATION',
  ENVIRONMENT = 'ENVIRONMENT',
  BIOLOGIC = 'BIOLOGIC',
}

export enum AllergyCriticalityDto {
  LOW = 'LOW',
  HIGH = 'HIGH',
  UNABLE_TO_ASSESS = 'UNABLE_TO_ASSESS',
}

export class CreateAllergyDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'Penicilina' })
  @IsString()
  display: string;

  @ApiProperty({ enum: AllergyCategoryDto })
  @IsEnum(AllergyCategoryDto)
  category: AllergyCategoryDto;

  @ApiProperty({ enum: AllergyCriticalityDto })
  @IsEnum(AllergyCriticalityDto)
  criticality: AllergyCriticalityDto;

  @ApiProperty({ required: false, example: 'Urticária, prurido' })
  @IsOptional()
  @IsString()
  reactions?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

// ============================================================================
// CONDITIONS / DIAGNÓSTICOS
// ============================================================================

export enum ConditionClinicalStatusDto {
  ACTIVE = 'ACTIVE',
  RECURRENCE = 'RECURRENCE',
  RELAPSE = 'RELAPSE',
  INACTIVE = 'INACTIVE',
  REMISSION = 'REMISSION',
  RESOLVED = 'RESOLVED',
}

export class CreateConditionDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'I10', description: 'CID-10 code', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 'Hipertensão arterial essencial' })
  @IsString()
  display: string;

  @ApiProperty({ enum: ConditionClinicalStatusDto })
  @IsEnum(ConditionClinicalStatusDto)
  clinicalStatus: ConditionClinicalStatusDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  onsetDateTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

// ============================================================================
// IMMUNIZATIONS
// ============================================================================

export class CreateImmunizationDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'COVID-19 Pfizer' })
  @IsString()
  vaccineDisplay: string;

  @ApiProperty()
  @IsDateString()
  occurrenceDate: string;

  @ApiProperty({ required: false, example: 'ABC123' })
  @IsOptional()
  @IsString()
  lotNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiProperty({ required: false, example: 'Pfizer' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty({ required: false, example: 'Braço esquerdo' })
  @IsOptional()
  @IsString()
  site?: string;

  @ApiProperty({ required: false, example: 'Intramuscular' })
  @IsOptional()
  @IsString()
  route?: string;
}

// ============================================================================
// TIMELINE QUERY
// ============================================================================

export class TimelineQueryDto {
  @ApiProperty({ required: false, description: 'Data de início' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({ required: false, description: 'Data de fim' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiProperty({ 
    required: false, 
    isArray: true,
    description: 'Tipos de eventos',
    example: ['encounters', 'notes', 'observations']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[];

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize?: number = 50;
}

// ============================================================================
// DOCUMENT UPLOAD
// ============================================================================

export class UploadDocumentDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  encounterId?: string;

  @ApiProperty({ example: 'EXAM_RESULT' })
  @IsString()
  type: string;

  @ApiProperty({ required: false, example: 'Resultado de Hemograma' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

// ============================================================================
// BREAK-THE-GLASS
// ============================================================================

export class BreakTheGlassDto {
  @ApiProperty({ example: 'Patient' })
  @IsString()
  resourceType: string;

  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  resourceId: string;

  @ApiProperty({ 
    example: 'Paciente em estado grave, necessário acesso imediato ao histórico médico',
    minLength: 20 
  })
  @IsString()
  @MinLength(20)
  justification: string;
}

// ============================================================================
// ENCOUNTERS
// ============================================================================

export enum EncounterClassDto {
  AMBULATORY = 'AMBULATORY',
  EMERGENCY = 'EMERGENCY',
  INPATIENT = 'INPATIENT',
  HOME = 'HOME',
  VIRTUAL = 'VIRTUAL',
}

export class CreateEncounterDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'practitioner-uuid' })
  @IsString()
  practitionerId: string;

  @ApiProperty({ enum: EncounterClassDto })
  @IsEnum(EncounterClassDto)
  class: EncounterClassDto;

  @ApiProperty()
  @IsDateString()
  scheduledStart: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledEnd?: string;

  @ApiProperty({ required: false, example: 'Cardiologia' })
  @IsOptional()
  @IsString()
  serviceType?: string;

  @ApiProperty({ required: false, example: 'Dor no peito' })
  @IsOptional()
  @IsString()
  reasonDisplay?: string;

  @ApiProperty({ required: false, example: 'Sala 1' })
  @IsOptional()
  @IsString()
  room?: string;
}

// ============================================================================
// MEDICATION STATEMENTS
// ============================================================================

export class CreateMedicationStatementDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'Losartana 50mg' })
  @IsString()
  medicationDisplay: string;

  @ApiProperty({ 
    example: { dose: '50mg', frequency: '1x ao dia', route: 'oral' } 
  })
  @IsOptional()
  dosage?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  effectiveStart?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  effectiveEnd?: string;

  @ApiProperty({ required: false, example: 'Hipertensão' })
  @IsOptional()
  @IsString()
  reasonDisplay?: string;
}




