"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMedicationStatementDto = exports.CreateEncounterDto = exports.EncounterClassDto = exports.BreakTheGlassDto = exports.UploadDocumentDto = exports.TimelineQueryDto = exports.CreateImmunizationDto = exports.CreateConditionDto = exports.ConditionClinicalStatusDto = exports.CreateAllergyDto = exports.AllergyCriticalityDto = exports.AllergyCategoryDto = exports.CreatePrescriptionDto = exports.PrescriptionItemDto = exports.RecordVitalSignsDto = exports.VitalSignDto = exports.SignNoteDto = exports.CreateSoapNoteDto = exports.NoteTypeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var NoteTypeDto;
(function (NoteTypeDto) {
    NoteTypeDto["SOAP"] = "SOAP";
    NoteTypeDto["PROGRESS"] = "PROGRESS";
    NoteTypeDto["ADMISSION"] = "ADMISSION";
    NoteTypeDto["DISCHARGE"] = "DISCHARGE";
    NoteTypeDto["CONSULT"] = "CONSULT";
    NoteTypeDto["PROCEDURE"] = "PROCEDURE";
})(NoteTypeDto || (exports.NoteTypeDto = NoteTypeDto = {}));
class CreateSoapNoteDto {
}
exports.CreateSoapNoteDto = CreateSoapNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoapNoteDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'encounter-uuid', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoapNoteDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Paciente relata dor de cabeça há 3 dias...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateSoapNoteDto.prototype, "subjective", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PA: 120/80 mmHg, FC: 72 bpm, Tax: 36.5°C...' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoapNoteDto.prototype, "objective", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cefaleia tensional. HAS controlada.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoapNoteDto.prototype, "assessment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Prescrito analgésico. Retorno em 7 dias.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoapNoteDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Consulta de rotina' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoapNoteDto.prototype, "title", void 0);
class SignNoteDto {
}
exports.SignNoteDto = SignNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'note-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignNoteDto.prototype, "noteId", void 0);
class VitalSignDto {
}
exports.VitalSignDto = VitalSignDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '8310-5', description: 'LOINC code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VitalSignDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Temperatura corporal' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VitalSignDto.prototype, "display", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 36.5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '°C' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VitalSignDto.prototype, "unit", void 0);
class RecordVitalSignsDto {
}
exports.RecordVitalSignsDto = RecordVitalSignsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordVitalSignsDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'encounter-uuid', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordVitalSignsDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [VitalSignDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => VitalSignDto),
    __metadata("design:type", Array)
], RecordVitalSignsDto.prototype, "vitalSigns", void 0);
class PrescriptionItemDto {
}
exports.PrescriptionItemDto = PrescriptionItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Amoxicilina 500mg' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "medication", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1 cápsula a cada 8 horas' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '7 dias' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "notes", void 0);
class CreatePrescriptionDto {
}
exports.CreatePrescriptionDto = CreatePrescriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'encounter-uuid', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PrescriptionItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PrescriptionItemDto),
    __metadata("design:type", Array)
], CreatePrescriptionDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "notes", void 0);
var AllergyCategoryDto;
(function (AllergyCategoryDto) {
    AllergyCategoryDto["FOOD"] = "FOOD";
    AllergyCategoryDto["MEDICATION"] = "MEDICATION";
    AllergyCategoryDto["ENVIRONMENT"] = "ENVIRONMENT";
    AllergyCategoryDto["BIOLOGIC"] = "BIOLOGIC";
})(AllergyCategoryDto || (exports.AllergyCategoryDto = AllergyCategoryDto = {}));
var AllergyCriticalityDto;
(function (AllergyCriticalityDto) {
    AllergyCriticalityDto["LOW"] = "LOW";
    AllergyCriticalityDto["HIGH"] = "HIGH";
    AllergyCriticalityDto["UNABLE_TO_ASSESS"] = "UNABLE_TO_ASSESS";
})(AllergyCriticalityDto || (exports.AllergyCriticalityDto = AllergyCriticalityDto = {}));
class CreateAllergyDto {
}
exports.CreateAllergyDto = CreateAllergyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Penicilina' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "display", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AllergyCategoryDto }),
    (0, class_validator_1.IsEnum)(AllergyCategoryDto),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AllergyCriticalityDto }),
    (0, class_validator_1.IsEnum)(AllergyCriticalityDto),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "criticality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Urticária, prurido' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "reactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAllergyDto.prototype, "notes", void 0);
var ConditionClinicalStatusDto;
(function (ConditionClinicalStatusDto) {
    ConditionClinicalStatusDto["ACTIVE"] = "ACTIVE";
    ConditionClinicalStatusDto["RECURRENCE"] = "RECURRENCE";
    ConditionClinicalStatusDto["RELAPSE"] = "RELAPSE";
    ConditionClinicalStatusDto["INACTIVE"] = "INACTIVE";
    ConditionClinicalStatusDto["REMISSION"] = "REMISSION";
    ConditionClinicalStatusDto["RESOLVED"] = "RESOLVED";
})(ConditionClinicalStatusDto || (exports.ConditionClinicalStatusDto = ConditionClinicalStatusDto = {}));
class CreateConditionDto {
}
exports.CreateConditionDto = CreateConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConditionDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'I10', description: 'CID-10 code', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConditionDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hipertensão arterial essencial' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConditionDto.prototype, "display", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ConditionClinicalStatusDto }),
    (0, class_validator_1.IsEnum)(ConditionClinicalStatusDto),
    __metadata("design:type", String)
], CreateConditionDto.prototype, "clinicalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConditionDto.prototype, "onsetDateTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConditionDto.prototype, "notes", void 0);
class CreateImmunizationDto {
}
exports.CreateImmunizationDto = CreateImmunizationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'COVID-19 Pfizer' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "vaccineDisplay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "occurrenceDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'ABC123' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "lotNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Pfizer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Braço esquerdo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Intramuscular' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "route", void 0);
class TimelineQueryDto {
    constructor() {
        this.page = 1;
        this.pageSize = 50;
    }
}
exports.TimelineQueryDto = TimelineQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Data de início' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TimelineQueryDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Data de fim' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TimelineQueryDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        isArray: true,
        description: 'Tipos de eventos',
        example: ['encounters', 'notes', 'observations']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], TimelineQueryDto.prototype, "types", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TimelineQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], TimelineQueryDto.prototype, "pageSize", void 0);
class UploadDocumentDto {
}
exports.UploadDocumentDto = UploadDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "encounterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EXAM_RESULT' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Resultado de Hemograma' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadDocumentDto.prototype, "description", void 0);
class BreakTheGlassDto {
}
exports.BreakTheGlassDto = BreakTheGlassDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Patient' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BreakTheGlassDto.prototype, "resourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BreakTheGlassDto.prototype, "resourceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Paciente em estado grave, necessário acesso imediato ao histórico médico',
        minLength: 20
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    __metadata("design:type", String)
], BreakTheGlassDto.prototype, "justification", void 0);
var EncounterClassDto;
(function (EncounterClassDto) {
    EncounterClassDto["AMBULATORY"] = "AMBULATORY";
    EncounterClassDto["EMERGENCY"] = "EMERGENCY";
    EncounterClassDto["INPATIENT"] = "INPATIENT";
    EncounterClassDto["HOME"] = "HOME";
    EncounterClassDto["VIRTUAL"] = "VIRTUAL";
})(EncounterClassDto || (exports.EncounterClassDto = EncounterClassDto = {}));
class CreateEncounterDto {
}
exports.CreateEncounterDto = CreateEncounterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'practitioner-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "practitionerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EncounterClassDto }),
    (0, class_validator_1.IsEnum)(EncounterClassDto),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "scheduledStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "scheduledEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Cardiologia' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "serviceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Dor no peito' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "reasonDisplay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Sala 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncounterDto.prototype, "room", void 0);
class CreateMedicationStatementDto {
}
exports.CreateMedicationStatementDto = CreateMedicationStatementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationStatementDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Losartana 50mg' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationStatementDto.prototype, "medicationDisplay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { dose: '50mg', frequency: '1x ao dia', route: 'oral' }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateMedicationStatementDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMedicationStatementDto.prototype, "effectiveStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMedicationStatementDto.prototype, "effectiveEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Hipertensão' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationStatementDto.prototype, "reasonDisplay", void 0);
//# sourceMappingURL=ehr.dto.js.map