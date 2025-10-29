import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto, ListPatientsQueryDto } from './dto/patient.dto';
export declare class PatientsController {
    private readonly service;
    constructor(service: PatientsService);
    list(query: ListPatientsQueryDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        birthDate: Date | null;
        document: string | null;
        phone: string | null;
        address: string | null;
        consentGivenAt: Date | null;
        notes: string | null;
    }[]>;
    create(body: CreatePatientDto): import(".prisma/client").Prisma.Prisma__PatientClient<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        birthDate: Date | null;
        document: string | null;
        phone: string | null;
        address: string | null;
        consentGivenAt: Date | null;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    get(id: string): import(".prisma/client").Prisma.Prisma__PatientClient<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        birthDate: Date | null;
        document: string | null;
        phone: string | null;
        address: string | null;
        consentGivenAt: Date | null;
        notes: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, body: UpdatePatientDto): import(".prisma/client").Prisma.Prisma__PatientClient<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        birthDate: Date | null;
        document: string | null;
        phone: string | null;
        address: string | null;
        consentGivenAt: Date | null;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__PatientClient<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        birthDate: Date | null;
        document: string | null;
        phone: string | null;
        address: string | null;
        consentGivenAt: Date | null;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    history(id: string): Promise<{
        procedures: ({
            costSheet: {
                id: string;
                createdAt: Date;
                marginTarget: import("@prisma/client/runtime/library").Decimal;
                procedureId: string;
                itemsCost: import("@prisma/client/runtime/library").Decimal;
                laborCost: import("@prisma/client/runtime/library").Decimal;
                overheadCost: import("@prisma/client/runtime/library").Decimal;
                totalCost: import("@prisma/client/runtime/library").Decimal;
                suggestedPrice: import("@prisma/client/runtime/library").Decimal;
            } | null;
            payments: {
                id: string;
                status: import(".prisma/client").$Enums.PaymentStatus;
                method: import(".prisma/client").$Enums.PaymentMethod;
                amount: import("@prisma/client/runtime/library").Decimal;
                paidAt: Date | null;
                procedureId: string;
            }[];
        } & {
            id: string;
            notes: string | null;
            scheduledAt: Date;
            startedAt: Date | null;
            finishedAt: Date | null;
            room: string | null;
            status: import(".prisma/client").$Enums.ProcedureStatus;
            patientId: string;
            professionalUserId: string;
            procedureTypeId: string;
        })[];
    }>;
}
