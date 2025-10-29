import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma.service';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(name: string, email: string, password: string, role: string): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
    issueTokens(userId: string, email: string, role: string): {
        accessToken: any;
        refreshToken: any;
    };
}
