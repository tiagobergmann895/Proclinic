"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../common/prisma.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(name, email, password, role) {
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await this.prisma.user.create({ data: { name, email, role: role, passwordHash } });
        return this.issueTokens(user.id, user.email, user.role);
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        return user;
    }
    async login(email, password) {
        const user = await this.validateUser(email, password);
        return this.issueTokens(user.id, user.email, user.role);
    }
    issueTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const accessToken = this.jwt.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map