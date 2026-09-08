import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, PermissionScope } from './roles.decorator';

/**
 * RolesGuard — reflète la règle métier ECLIPSE V1.0.1 :
 *  - Admin CE : lecture + écriture complète sur tous les modules
 *  - Collaborateur CE / Salarié : lecture seule partout, sauf le Chat (géré séparément)
 *  - La visibilité (lecture) d'un module reste conditionnée par item.roles / permission,
 *    comme dans le prototype (accès Paiement / Dashboard pour les Collaborateurs).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const needsWrite = this.reflector.getAllAndOverride<boolean>('writeAccess', [
      context.getHandler(),
      context.getClass(),
    ]);
    const permission = this.reflector.getAllAndOverride<PermissionScope>('permission', [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new ForbiddenException('Non authentifié');

    if (needsWrite && user.role !== 'admin') {
      throw new ForbiddenException("Seul l'Admin CE peut créer, modifier ou supprimer cette ressource.");
    }
    if (requiredRoles && requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException("Vous n'avez pas accès à ce module.");
    }
    // Filtrage fin pour le Collaborateur CE uniquement (Admin et Salarié ne sont jamais filtrés ici).
    if (permission && user.role === 'collab' && user.access !== 'both' && user.access !== permission) {
      throw new ForbiddenException("Vous n'avez pas accès à ce module.");
    }
    return true;
  }
}
