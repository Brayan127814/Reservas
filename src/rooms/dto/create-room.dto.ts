import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRoomDto {

    @IsNumber()
    piso: number

    @IsNumber()
    numero: number
    @IsNumber()
    precio:number

    @IsString()
    @IsOptional()
    estado?: string

    @IsString()
    @IsOptional()
    descripcion:string
}
