import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, throwIfEmpty } from "rxjs";
import { ROLE_KEY } from "src/decorators/roles.decorators";


@Injectable()

export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requeridRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if (!requeridRoles) return true

        const { user } = context.switchToHttp().getRequest()
        return requeridRoles.includes(user.rol)
    }
}