import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { classToClassFromExist } from "class-transformer";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('SECRETKEY') || 'JKFDJKSADHKJFHD'
        })
    }

    validate(payload: any) {
        return {
            id: payload.sub,
            correo: payload.correo,
            rol: payload.rol
        }
    }
}