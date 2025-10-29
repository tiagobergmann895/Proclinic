import { ProcedureTypesService } from './procedure-types.service';
export declare class ProcedureTypesController {
    private readonly service;
    constructor(service: ProcedureTypesService);
    list(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        description: string | null;
        defaultDurationMin: number;
        defaultItems: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    create(body: any): import(".prisma/client").Prisma.Prisma__ProcedureTypeClient<{
        id: string;
        name: string;
        description: string | null;
        defaultDurationMin: number;
        defaultItems: import("@prisma/client/runtime/library").JsonValue;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    get(id: string): import(".prisma/client").Prisma.Prisma__ProcedureTypeClient<{
        id: string;
        name: string;
        description: string | null;
        defaultDurationMin: number;
        defaultItems: import("@prisma/client/runtime/library").JsonValue;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, body: any): import(".prisma/client").Prisma.Prisma__ProcedureTypeClient<{
        id: string;
        name: string;
        description: string | null;
        defaultDurationMin: number;
        defaultItems: import("@prisma/client/runtime/library").JsonValue;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ProcedureTypeClient<{
        id: string;
        name: string;
        description: string | null;
        defaultDurationMin: number;
        defaultItems: import("@prisma/client/runtime/library").JsonValue;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
