import { IsEmail, IsString, Length } from "class-validator";

export class CreateHuespedeDto {
    @IsString()
    nombre: string
    @IsString()
    apellido: string
    @IsEmail()
    correo: string

    @IsString()
    @Length(5, 20)
    contraseña: string


}
