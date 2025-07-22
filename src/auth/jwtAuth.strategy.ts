import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";



@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy){
    constructor(configService:ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:configService.get<string>('SECRETKEY') || 'oconer%&$#'
        })
    }

    async validate(payload: any){
        return {
            id:payload.sub,
            correo: payload.correo,
            rol: payload.rol
        }
    }
}

// @Injectable()
// export class jwtStrategy extends PassportStrategy(Strategy){

//     constructor (configService : ConfigService){
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration:false,
//             secretOrKey: configService.get<string>('SECRETKEY') || 'DEFAULT'
//         })
//     }

//     async validate( payload: any){
//         return {
//             id:payload.id,
//             correo: payload.correo,
//             rol: payload.rol
//         }
//     }

// }