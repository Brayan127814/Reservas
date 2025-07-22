import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ESTADOHABITACION } from 'src/enums/estado-habitacion.enum';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    @IsEnum(ESTADOHABITACION,{
        message:'Estado invalido los estados deber ser OCUPADA, DISPONIBLE O MANTENIMIENTO'
    })
    @IsOptional()
    estado?: ESTADOHABITACION
}
