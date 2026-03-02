import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string, pass: string): Promise<{ access_token: string }> {
        try {
            console.log('Tentando login para:', email);
            const user = await this.prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                console.log('Usuário não encontrado');
                throw new UnauthorizedException('Credenciais inválidas - Usuário não encontrado');
            }

            console.log('Usuário encontrado. Verificando senha...');
            const isMatch = await bcrypt.compare(pass, user.password);

            if (!isMatch) {
                console.log('Senha incorreta');
                throw new UnauthorizedException('Credenciais inválidas - Senha incorreta');
            }

            console.log('Senha correta. Gerando token...');
            const payload = { sub: user.id, email: user.email };
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    async register(data: { name: string; email: string; password: string; tenantName: string }) {
        const { name, email, password, tenantName } = data;

        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new UnauthorizedException('Email já está em uso.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction to create User, Tenant and Membership
        const result = await this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

            const tenant = await prisma.tenant.create({
                data: {
                    name: tenantName,
                },
            });

            await prisma.userMembership.create({
                data: {
                    userId: user.id,
                    tenantId: tenant.id,
                    role: 'OWNER',
                },
            });

            return user;
        });

        return this.signIn(result.email, password);
    }

    async getProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                memberships: {
                    include: {
                        tenant: true,
                    },
                },
            },
        });
    }

    async test() {
        return 'Service OK';
    }

    async testPrisma() {
        try {
            const userCount = await this.prisma.user.count();
            const tenantCount = await this.prisma.tenant.count();
            return `Prisma OK. Users: ${userCount}, Tenants: ${tenantCount}`;
        } catch (e) {
            return `Prisma Error: ${e.message}\nStack: ${e.stack}`;
        }
    }

    async testBcrypt() {
        try {
            const hash = await bcrypt.hash('test', 10);
            return `Bcrypt OK. Hash: ${hash}`;
        } catch (e) {
            return `Bcrypt Error: ${e.message}`;
        }
    }
}
