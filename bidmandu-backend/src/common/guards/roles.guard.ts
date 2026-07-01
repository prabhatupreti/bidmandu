import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // If ADMIN is required, check user.role === 'ADMIN'
    if (requiredRoles.includes('ADMIN') && user.role !== 'ADMIN') {
      return false;
    }
    // If SELLER is required, check is_seller flag
    if (requiredRoles.includes('SELLER') && !user.is_seller) {
      return false;
    }
    // BUYER role is default for any authenticated user
    if (requiredRoles.includes('BUYER') && !user) {
      return false;
    }
    return true;
  }
}