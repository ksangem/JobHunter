import { SetMetadata } from '@nestjs/common';
import { Role } from '@jobhunter/types';

export const ROLES_KEY = 'roles';
/** Restrict a route to one or more roles. Enforced by RolesGuard. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
