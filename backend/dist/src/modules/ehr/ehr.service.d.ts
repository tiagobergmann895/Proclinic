import { PrismaService } from '../../common/prisma.service';
import { AuditService } from './audit.service';
export declare class EhrService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    getPatientTimeline(patientId: string, userId: string, tenantId: string, options: {
        from?: Date;
        to?: Date;
        types?: string[];
        page?: number;
        pageSize?: number;
    }): Promise<{
        timeline: any[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    createSoapNote(data: {
        patientId: string;
        encounterId?: string;
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
        title?: string;
    }, userId: string, tenantId: string): Promise<any>;
    signClinicalNote(noteId: string, userId: string, tenantId: string): Promise<any>;
    recordVitalSigns(data: {
        patientId: string;
        encounterId?: string;
        vitalSigns: Array<{
            code: string;
            display: string;
            value: number;
            unit: string;
        }>;
    }, userId: string, tenantId: string): Promise<any>;
    private interpretVitalSign;
    createPrescription(data: {
        patientId: string;
        encounterId?: string;
        items: Array<{
            medication: string;
            dosage: string;
            duration: string;
            notes?: string;
        }>;
        notes?: string;
    }, userId: string, tenantId: string): Promise<{
        prescription: any;
        warnings: {
            severity: any;
            message: string;
            medication: string;
        }[] | undefined;
    }>;
    signPrescription(prescriptionId: string, userId: string, tenantId: string): Promise<any>;
    uploadDocument(file: {
        filename: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
    }, metadata: {
        patientId: string;
        encounterId?: string;
        type: string;
        title?: string;
        description?: string;
    }, userId: string, tenantId: string): Promise<any>;
    getPresignedDownloadUrl(documentId: string, userId: string, tenantId: string): Promise<{
        url: string;
        expiresIn: number;
    }>;
    exportPatientBundle(patientId: string, userId: string, tenantId: string): Promise<{
        resourceType: string;
        type: string;
        timestamp: string;
        entry: any[];
    }>;
    private mapPatientToFhir;
    private mapConditionToFhir;
    private mapAllergyToFhir;
    private mapMedicationToFhir;
    private mapImmunizationToFhir;
    private mapObservationToFhir;
    private checkAccess;
    breakTheGlass(userId: string, tenantId: string, resourceType: string, resourceId: string, justification: string): Promise<{
        granted: boolean;
        expiresIn: string;
    }>;
    private generateSummary;
}
