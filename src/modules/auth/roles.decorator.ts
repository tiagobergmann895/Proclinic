import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type AppRole = 'recepcao' | 'profissional' | 'financeiro' | 'gestor';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);














