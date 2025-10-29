import { PrismaService } from '../../common/prisma.service';
export declare class ProcedureTypesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        description: string | null;
        defaultDurationMin: number;
        defaultItems: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    create(data: any): import(".prisma/client").Prisma.Prisma__ProcedureTypeClient<{
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
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__ProcedureTypeClient<{
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
