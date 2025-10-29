export declare class CreatePatientDto {
    name: string;
    birthDate?: string;
    document?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
}
export declare class UpdatePatientDto {
    name?: string;
    birthDate?: string;
    document?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
}
export declare class ListPatientsQueryDto {
    q?: string;
    page?: number;
    pageSize?: number;
}
