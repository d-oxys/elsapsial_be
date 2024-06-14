import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Periksa apakah role pengguna sesuai dengan role yang diperlukan
    const hasRole = requiredRoles.some((role) => user.role?.role_name === role);

    if (!hasRole) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          error: 'Forbidden',
          message:
            "Access denied. Only users with the 'driver' role are permitted to view available orders.",
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return hasRole;
  }
}
