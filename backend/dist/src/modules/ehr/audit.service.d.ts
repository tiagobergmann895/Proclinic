import { PrismaService } from '../../common/prisma.service';
interface AuditLogInput {
    tenantId: string;
    userId?: string;
    userName?: string;
    userRole?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    description?: string;
    changes?: any;
    ipAddress?: string;
    userAgent?: string;
    accessPurpose?: string;
    justification?: string;
}
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(input: AuditLogInput): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getAuditTrail(tenantId: string, filters: {
        resourceType?: string;
        resourceId?: string;
        userId?: string;
        action?: string;
        from?: Date;
        to?: Date;
        page?: number;
        pageSize?: number;
    }): Promise<{
        logs: {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: string;
            entity: string;
            entityId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        pages: number;
    }>;
    verifyChainIntegrity(tenantId: string): Promise<{
        intact: boolean;
        totalLogs: number;
        issues: {
            logId: string;
            expectedPreviousHash: any;
            actualPreviousHash: any;
            timestamp: any;
        }[];
    }>;
}
export {};
