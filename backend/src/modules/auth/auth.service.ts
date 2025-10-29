import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(name: string, email: string, password: string, role: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({ data: { name, email, role: role as any, passwordHash } });
    return this.issueTokens(user.id, user.email, user.role);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.issueTokens(user.id, user.email, user.role);
  }

  issueTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwt.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}














