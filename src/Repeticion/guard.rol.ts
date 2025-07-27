import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ROLES_KEY } from "./rol.decortor"
import { Roles } from "./rol.decortor"
import { Observable } from "rxjs"

@Injectable()

export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requeridRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ])

        if(!requeridRoles) return true

        const {user} = context.switchToHttp().getRequest()

        return requeridRoles.includes(user.rol)
    }
}

