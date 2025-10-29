import { PrismaService } from '../../common/prisma.service';
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto, UpdateProcedureDto, ListProceduresQueryDto, FinishProcedureDto } from './dto/procedure.dto';
export declare class ProceduresController {
    private readonly prisma;
    private readonly service;
    constructor(prisma: PrismaService, service: ProceduresService);
    list(query: ListProceduresQueryDto): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    create(body: CreateProcedureDto): import(".prisma/client").Prisma.Prisma__ProcedureClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    get(id: string): import(".prisma/client").Prisma.Prisma__ProcedureClient<({
        patient: {
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
        };
        procedureType: {
            id: string;
            name: string;
            description: string | null;
            defaultDurationMin: number;
            defaultItems: import("@prisma/client/runtime/library").JsonValue;
        };
        professional: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
        };
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, body: UpdateProcedureDto): import(".prisma/client").Prisma.Prisma__ProcedureClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    start(id: string): import(".prisma/client").Prisma.Prisma__ProcedureClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    finish(id: string, body: FinishProcedureDto): Promise<{
        id: string;
        createdAt: Date;
        marginTarget: import("@prisma/client/runtime/library").Decimal;
        procedureId: string;
        itemsCost: import("@prisma/client/runtime/library").Decimal;
        laborCost: import("@prisma/client/runtime/library").Decimal;
        overheadCost: import("@prisma/client/runtime/library").Decimal;
        totalCost: import("@prisma/client/runtime/library").Decimal;
        suggestedPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
}
