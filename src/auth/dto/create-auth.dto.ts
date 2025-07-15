import { IsEmail, IsString} from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    correo: string

    @IsString()
    contraseña: string
}
