"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const crypto = __importStar(require("crypto"));
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(input) {
        const lastLog = await this.prisma.auditLog.findFirst({
            where: { tenantId: input.tenantId },
            orderBy: { timestamp: 'desc' },
            select: { currentHash: true },
        });
        const previousHash = (lastLog === null || lastLog === void 0 ? void 0 : lastLog.currentHash) || '0';
        const timestamp = new Date();
        const dataToHash = JSON.stringify({
            previousHash,
            timestamp: timestamp.toISOString(),
            userId: input.userId,
            action: input.action,
            resourceType: input.resourceType,
            resourceId: input.resourceId,
        });
        const currentHash = crypto.createHash('sha256').update(dataToHash).digest('hex');
        const auditLog = await this.prisma.auditLog.create({
            data: {
                tenantId: input.tenantId,
                userId: input.userId,
                userName: input.userName,
                userRole: input.userRole,
                action: input.action,
                resourceType: input.resourceType,
                resourceId: input.resourceId,
                description: input.description,
                changes: input.changes,
                ipAddress: input.ipAddress,
                userAgent: input.userAgent,
                accessPurpose: input.accessPurpose,
                justification: input.justification,
                previousHash,
                currentHash,
                timestamp,
            },
        });
        return auditLog;
    }
    async getAuditTrail(tenantId, filters) {
        const { page = 1, pageSize = 100, ...where } = filters;
        const auditLogs = await this.prisma.auditLog.findMany({
            where: {
                tenantId,
                ...where,
                ...(filters.from || filters.to ? {
                    timestamp: {
                        gte: filters.from,
                        lte: filters.to,
                    }
                } : {}),
            },
            orderBy: { timestamp: 'desc' },
            take: pageSize,
            skip: (page - 1) * pageSize,
            include: {
                user: {
                    select: { name: true, email: true, role: true },
                },
            },
        });
        const total = await this.prisma.auditLog.count({
            where: {
                tenantId,
                ...where,
            },
        });
        return {
            logs: auditLogs,
            total,
            page,
            pageSize,
            pages: Math.ceil(total / pageSize),
        };
    }
    async verifyChainIntegrity(tenantId) {
        const logs = await this.prisma.auditLog.findMany({
            where: { tenantId },
            orderBy: { timestamp: 'asc' },
            select: {
                id: true,
                previousHash: true,
                currentHash: true,
                timestamp: true,
                action: true,
            },
        });
        const issues = [];
        for (let i = 1; i < logs.length; i++) {
            if (logs[i].previousHash !== logs[i - 1].currentHash) {
                issues.push({
                    logId: logs[i].id,
                    expectedPreviousHash: logs[i - 1].currentHash,
                    actualPreviousHash: logs[i].previousHash,
                    timestamp: logs[i].timestamp,
                });
            }
        }
        return {
            intact: issues.length === 0,
            totalLogs: logs.length,
            issues,
        };
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map