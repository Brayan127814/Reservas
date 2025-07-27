import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { classToClassFromExist } from "class-transformer";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy){
    constructor (configService:ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:configService.get<string>('SECRETKEY') || 'SJKJFLJSLJL'
        })
    }

    validate(payload:any){
        return{
            id: payload.sub,
            rol:payload.correo,
            correo:payload.correo
        }
    }
}