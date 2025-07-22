import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  ArrayNotEmpty,
  IsPositive,
} from 'class-validator';

export class CreateReservaDto {
  @IsDateString()
  @IsNotEmpty()
  fechaInicio: Date;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: Date;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true }) // cada elemento del array debe ser número
  @IsPositive({ each: true })   // cada ID debe ser positivo
  rooms: number[]; // arreglo de IDs de habitaciones

}
