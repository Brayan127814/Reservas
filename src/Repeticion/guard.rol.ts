import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "./rol.decortor";
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requeridRole = this.reflector.getAllAndOverride<string[]>(ROLE_KEY,[
            context.getHandler(),
            context.getClass()
        ])

        if(!requeridRole) return true

        const {user}= context.switchToHttp().getRequest()

        return requeridRole.includes(user.rol)
    }
}