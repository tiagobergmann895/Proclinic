import { ProcedureStatus } from '@prisma/client';
export declare class CreateProcedureDto {
    patientId: string;
    professionalUserId: string;
    procedureTypeId: string;
    scheduledAt: string;
    notes?: string;
}
export declare class UpdateProcedureDto {
    patientId?: string;
    professionalUserId?: string;
    procedureTypeId?: string;
    scheduledAt?: string;
    status?: ProcedureStatus;
    notes?: string;
}
export declare class ListProceduresQueryDto {
    patientId?: string;
    professionalUserId?: string;
    procedureTypeId?: string;
    status?: ProcedureStatus;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
}
export declare class ItemUsageDto {
    itemId: string;
    quantity: number;
}
export declare class FinishProcedureDto {
    itemsUsed: ItemUsageDto[];
    performedByUserId: string;
}
