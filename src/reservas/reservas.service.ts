import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UseGuards, UsePipes } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { LessThan, Repository } from 'typeorm';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room } from 'src/rooms/entities/room.entity';
import { Huespedes } from 'src/huespedes/entities/huespede.entity';
import { ESTADOHABITACION } from 'src/enums/estado-habitacion.enum';
import { ESTADORESERVA } from 'src/enums/estado-reserva.enum';
import { RelationIdAttribute } from 'typeorm/query-builder/relation-id/RelationIdAttribute';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JwtAuthGuar } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { todosLosPermisos } from 'src/helpers/permisoTotal';


@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Huespedes)
    private readonly huespedRepository: Repository<Huespedes>

  ) { }
  //CREAR RESERVA
  async create(createReservaDto: CreateReservaDto, huespedID: number) {
    try {
      //Verificar que las habitaciones existan
      const rooms = await this.roomRepository.findByIds(createReservaDto.rooms)
      if (rooms.length !== createReservaDto.rooms.length) {
        throw new NotFoundException('Una o mas habitaciones no se encuentran registradas')
      }

      //VALIDAR DISPONIBILIDAD
      const estado = rooms.filter(room => room.estado !== 'disponible')
      if (estado.length > 0) {
        throw new BadGatewayException(`las siguientes habitanciones están ocupadas ${estado.map(r => r.numero).join(' ,')}`)
      }

      //OBTENER EL HUESPED
      const huesped = await this.huespedRepository.findOne({ where: { id: huespedID } })

      if (!huesped) {
        throw new NotFoundException('Huesped no encontrado')
      }


      //Cambiar el estado de las habitaciones a ocupadas

      for (let room of rooms) {
        {
          room.estado = ESTADOHABITACION.OCUPADA
          await this.roomRepository.save(room)
        }
      }

      //Validar fechas 
      let hoy = new Date()
      let fechaInicio = new Date(createReservaDto.fechaInicio)
      let fechaFin = new Date(createReservaDto.fechaFin)
      if (fechaInicio < hoy) {
        throw new NotFoundException('La fecha de inicio no puede ser anterio a hoy')
      }
      if (fechaInicio > fechaFin) {
        throw new NotFoundException('La fecha de inico no puede ser mayor a la fecha de salida')
      }
      const cantidadNoches = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      console.log(cantidadNoches)
      const total = rooms.reduce((acc, val) => {
        return acc + (val.precio * cantidadNoches)
      }, 0)
      //Crear la nuva reserva
      const newReserva = this.reservaRepository.create({
        fechaInicio: createReservaDto.fechaInicio,
        fechaFin: createReservaDto.fechaFin,
        estado: ESTADORESERVA.CONFIRMADA,
        huesped: huesped,
        rooms: rooms,
        total: total



      })

      return this.reservaRepository.save(newReserva)


    } catch (error) {
      console.error('Error en ReservasService.create:', error?.message || error);

      // Si ya es una HttpException (como BadGateway o NotFound lanzadas antes), simplemente relanzamos
      if (error instanceof HttpException) {
        throw error;
      }

      // Si es cualquier otro error no controlado, lanzamos un 500
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async findAll(huespeId: number, rol: string): Promise<Reserva[]> {

    try {

      if (todosLosPermisos(rol)) {
        return this.reservaRepository.find({
          relations:['rooms','huesped']
        })

      } 

      return await this.reservaRepository.find({
        where:{
          huesped:{id:huespeId}
        },
        relations:['rooms','huesped']
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException('Error interno en el servidor', HttpStatus.INTERNAL_SERVER_ERROR)
    }



  }


  async findOne(id: number, huesped: number, rol: string): Promise<Reserva> {
    try {
      let reserva: Reserva | null = null
      console.log('rol', rol)
      if (rol === 'Admin' || rol === "recepcionista") {
        reserva = await this.reservaRepository.findOne({
          where: {
            id
          },
          relations: ['rooms', 'huesped']
        })

      } else {
        reserva = await this.reservaRepository.findOne({
          where: {
            id,
            huesped: { id: huesped }
          },
          relations: ['rooms', 'huesped']
        })


      }




      if (!reserva) {
        throw new NotFoundException('Reserva no encontrada')
      }

      return reserva
    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException('error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  //Actualizar datos de la reserva
  async update(id: number, updateReservaDto: Partial<UpdateReservaDto>, huespedID: number, rol: string) {

    try {

      let reserva: Reserva | null = null
      if (todosLosPermisos(rol)) {
        reserva = await this.reservaRepository.findOne({
          where: {
            id
          },
          relations: ['rooms', 'huesped']
        })
      } else {
        reserva = await this.reservaRepository.findOne({
          where: {
            id,
            huesped: { id: huespedID }
          }
        })
      }




      if (!reserva) {
        throw new NotFoundException('Rserva no no encontrada')
      }

      let hoy = new Date()
      let newfechaInicio = updateReservaDto.fechaInicio ? new Date(updateReservaDto.fechaInicio) : null
      let newFechaFin = updateReservaDto.fechaFin ? new Date(updateReservaDto.fechaFin) : null

      if (newfechaInicio) {
        if (newfechaInicio < hoy) {
          throw new BadRequestException('la nueva fecha de inicio no puede ser anterior a hoy')
        }
      }

      //validar que la fecha de finalizacion sea proporcionada

      if (newFechaFin) {
        if (newfechaInicio && newFechaFin <= newfechaInicio) {
          throw new BadRequestException('La fecha de finalización no debe ser menor a la fecha de inicio')
        }
      }


      // Al hacer esta actufalizacion de fechas se deba actualizar el total a pagar

      // const cantidadNoches = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      let cantidadNoches: number = 0
      if (newfechaInicio && newFechaFin) {
        cantidadNoches = Math.ceil((newFechaFin.getTime() - newfechaInicio.getTime()) / (100 * 60 * 60 * 24))
      }

      //Actualizar total

      const newTotal = reserva.rooms.reduce((total, val) => {
        return (total + (val.precio * cantidadNoches))
      }, 0)

      reserva.total = newTotal

      //Guardar la actualizacion

      Object.assign(reserva, updateReservaDto)

      return this.reservaRepository.save(reserva)


    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException('Error interno del servidor ', HttpStatus.INTERNAL_SERVER_ERROR)

    }

  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }
  async cancelReservation(id: number, huespeId: number, rol: string) {
    try {
      let reserva: Reserva | null = null
      if (todosLosPermisos(rol)) {
        reserva = await this.reservaRepository.findOne({
          where: {
            id,

          }, relations: ['rooms', 'huesped']
        })
      } else {
        reserva = await this.reservaRepository.findOne({
          where: {
            id,
            huesped: {
              id: huespeId,
            },
          },
          relations: ['huesped', 'rooms'],
        });


      }



      if (!reserva) {
        throw new NotFoundException('Reserva no encontrada')
      }

      if (reserva.estado !== ESTADORESERVA.CONFIRMADA) {
        throw new BadRequestException('Solo se pueden cancelar reservas confirmadas')
      }

      await this.reservaRepository.update(id, {
        estado: ESTADORESERVA.CANCELADA
      })

      if (reserva.rooms && reserva.rooms.length > 0) {
        const roomIds = reserva.rooms.map(h => h.id)
        await this.roomRepository.update(roomIds, {
          estado: ESTADOHABITACION.DISPONIBLE
        })
      }

      return {
        message: 'Reserva cancelada exitosamente',
        reservaId: id
      }

    } catch (error) {
      console.error(error)
      throw new HttpException('Error interno al cancelar la reserva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //Reservas Expiradas
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async reservasExpiradas() {
    try {
      const expiradas = await this.reservaRepository.find({//ESTO VA A TRAER LAS RESERVAS CUYA FINALIZACIÓN HAYA ES MENOR A HOY
        where: {
          fechaFin: LessThan(new Date()),
          estado: 'confirmada'
        },
        relations: ['rooms']
      })
      // SI LA RESPUESTA ES UN ARREGLO VACIO TERMINAMOS
      if (expiradas.length === 0) { return [] }

      //CABIAR ESTADO DE LA RESERVA
      for (let reserva of expiradas) {
        reserva.estado = ESTADORESERVA.CANCELADA
        await this.reservaRepository.save(reserva)
      }




      const roomID = expiradas.flatMap(r => r.rooms.map(room => room.id))
      //Cambiar estados
      await this.roomRepository.update(roomID, {
        estado: ESTADOHABITACION.DISPONIBLE
      })
      return {
        reservasActualizadas: expiradas.length,
        habitacionesActualizadas: roomID
      }



    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }
      // Si es cualquier otro error no controlado, lanzamos un 500
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

}