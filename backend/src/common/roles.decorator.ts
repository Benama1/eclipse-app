import { SetMetadata } from '@nestjs/common';

export type Role = 'admin' | 'collab' | 'employee';

/** Déclare les rôles autorisés à ACCÉDER (lecture) à une route. */
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

/** Marque une route comme nécessitant les droits d'écriture (Admin CE uniquement),
 *  sauf pour le Chat où tous les rôles ont l'écriture (voir chat.gateway.ts). */
export const WriteAccess = () => SetMetadata('writeAccess', true);

/**
 * Restreint la visibilité d'un module pour le Collaborateur CE selon son champ `access`
 * ('payment' | 'dashboard' | 'both'), comme dans le prototype V1 (hasPermission()).
 * N'a aucun effet sur Admin CE (accès total) ni sur Salarié (lecture illimitée sur les
 * modules qui lui sont ouverts) — seul le Collaborateur CE est filtré.
 */
export type PermissionScope = 'payment' | 'dashboard';
export const Permission = (scope: PermissionScope) => SetMetadata('permission', scope);
