import { EhrService } from './ehr.service';
import { CreateSoapNoteDto, SignNoteDto, RecordVitalSignsDto, CreatePrescriptionDto, CreateAllergyDto, CreateConditionDto, CreateImmunizationDto, TimelineQueryDto, UploadDocumentDto, BreakTheGlassDto, CreateEncounterDto } from './dto/ehr.dto';
export declare class EhrController {
    private readonly service;
    constructor(service: EhrService);
    getTimeline(patientId: string, query: TimelineQueryDto, req: any): Promise<{
        timeline: any[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    createSoapNote(dto: CreateSoapNoteDto, req: any): Promise<any>;
    signNote(dto: SignNoteDto, req: any): Promise<any>;
    recordVitalSigns(dto: RecordVitalSignsDto, req: any): Promise<any>;
    getVitalSigns(patientId: string, code?: string, from?: string, to?: string, req: any): {
        message: string;
    };
    createPrescription(dto: CreatePrescriptionDto, req: any): Promise<{
        prescription: any;
        warnings: {
            severity: any;
            message: string;
            medication: string;
        }[] | undefined;
    }>;
    signPrescription(id: string, req: any): Promise<any>;
    createAllergy(dto: CreateAllergyDto, req: any): {
        message: string;
    };
    getAllergies(patientId: string, req: any): {
        message: string;
    };
    createCondition(dto: CreateConditionDto, req: any): {
        message: string;
    };
    getConditions(patientId: string, status?: string, req: any): {
        message: string;
    };
    createImmunization(dto: CreateImmunizationDto, req: any): {
        message: string;
    };
    getImmunizations(patientId: string, req: any): {
        message: string;
    };
    uploadDocument(file: Express.Multer.File, dto: UploadDocumentDto, req: any): Promise<any>;
    downloadDocument(id: string, req: any): Promise<{
        url: string;
        expiresIn: number;
    }>;
    exportFhir(patientId: string, req: any): Promise<{
        resourceType: string;
        type: string;
        timestamp: string;
        entry: any[];
    }>;
    createEncounter(dto: CreateEncounterDto, req: any): {
        message: string;
    };
    startEncounter(id: string, req: any): {
        message: string;
    };
    finishEncounter(id: string, req: any): {
        message: string;
    };
    breakTheGlass(dto: BreakTheGlassDto, req: any): Promise<{
        granted: boolean;
        expiresIn: string;
    }>;
}
