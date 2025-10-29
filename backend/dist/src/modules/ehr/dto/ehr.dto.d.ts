export declare enum NoteTypeDto {
    SOAP = "SOAP",
    PROGRESS = "PROGRESS",
    ADMISSION = "ADMISSION",
    DISCHARGE = "DISCHARGE",
    CONSULT = "CONSULT",
    PROCEDURE = "PROCEDURE"
}
export declare class CreateSoapNoteDto {
    patientId: string;
    encounterId?: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    title?: string;
}
export declare class SignNoteDto {
    noteId: string;
}
export declare class VitalSignDto {
    code: string;
    display: string;
    value: number;
    unit: string;
}
export declare class RecordVitalSignsDto {
    patientId: string;
    encounterId?: string;
    vitalSigns: VitalSignDto[];
}
export declare class PrescriptionItemDto {
    medication: string;
    dosage: string;
    duration: string;
    notes?: string;
}
export declare class CreatePrescriptionDto {
    patientId: string;
    encounterId?: string;
    items: PrescriptionItemDto[];
    notes?: string;
}
export declare enum AllergyCategoryDto {
    FOOD = "FOOD",
    MEDICATION = "MEDICATION",
    ENVIRONMENT = "ENVIRONMENT",
    BIOLOGIC = "BIOLOGIC"
}
export declare enum AllergyCriticalityDto {
    LOW = "LOW",
    HIGH = "HIGH",
    UNABLE_TO_ASSESS = "UNABLE_TO_ASSESS"
}
export declare class CreateAllergyDto {
    patientId: string;
    display: string;
    category: AllergyCategoryDto;
    criticality: AllergyCriticalityDto;
    reactions?: string;
    notes?: string;
}
export declare enum ConditionClinicalStatusDto {
    ACTIVE = "ACTIVE",
    RECURRENCE = "RECURRENCE",
    RELAPSE = "RELAPSE",
    INACTIVE = "INACTIVE",
    REMISSION = "REMISSION",
    RESOLVED = "RESOLVED"
}
export declare class CreateConditionDto {
    patientId: string;
    code?: string;
    display: string;
    clinicalStatus: ConditionClinicalStatusDto;
    onsetDateTime?: string;
    notes?: string;
}
export declare class CreateImmunizationDto {
    patientId: string;
    vaccineDisplay: string;
    occurrenceDate: string;
    lotNumber?: string;
    expirationDate?: string;
    manufacturer?: string;
    site?: string;
    route?: string;
}
export declare class TimelineQueryDto {
    from?: string;
    to?: string;
    types?: string[];
    page?: number;
    pageSize?: number;
}
export declare class UploadDocumentDto {
    patientId: string;
    encounterId?: string;
    type: string;
    title?: string;
    description?: string;
}
export declare class BreakTheGlassDto {
    resourceType: string;
    resourceId: string;
    justification: string;
}
export declare enum EncounterClassDto {
    AMBULATORY = "AMBULATORY",
    EMERGENCY = "EMERGENCY",
    INPATIENT = "INPATIENT",
    HOME = "HOME",
    VIRTUAL = "VIRTUAL"
}
export declare class CreateEncounterDto {
    patientId: string;
    practitionerId: string;
    class: EncounterClassDto;
    scheduledStart: string;
    scheduledEnd?: string;
    serviceType?: string;
    reasonDisplay?: string;
    room?: string;
}
export declare class CreateMedicationStatementDto {
    patientId: string;
    medicationDisplay: string;
    dosage?: any;
    effectiveStart?: string;
    effectiveEnd?: string;
    reasonDisplay?: string;
}
