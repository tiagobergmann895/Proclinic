export declare const ROLES_KEY = "roles";
export type AppRole = 'recepcao' | 'profissional' | 'financeiro' | 'gestor';
export declare const Roles: (...roles: AppRole[]) => import("@nestjs/common").CustomDecorator<string>;
