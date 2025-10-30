import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import * as crypto from 'crypto';

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

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: AuditLogInput) {
    // Buscar último hash da chain
    const lastLog = await this.prisma.auditLog.findFirst({
      where: { tenantId: input.tenantId },
      orderBy: { timestamp: 'desc' },
      select: { currentHash: true },
    });

    const previousHash = lastLog?.currentHash || '0';

    // Calcular hash atual (blockchain-like)
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

    // Criar log (append-only)
    const auditLog = await this.prisma.auditLog.create({
      data: {
        tenantId: input.tenantId,
        userId: input.userId,
        userName: input.userName,
        userRole: input.userRole,
        action: input.action as any,
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

  async getAuditTrail(
    tenantId: string,
    filters: {
      resourceType?: string;
      resourceId?: string;
      userId?: string;
      action?: string;
      from?: Date;
      to?: Date;
      page?: number;
      pageSize?: number;
    }
  ) {
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

  async verifyChainIntegrity(tenantId: string) {
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
}




