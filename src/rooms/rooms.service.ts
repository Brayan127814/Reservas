import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { NotFoundError, throwError } from 'rxjs';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>

  ) { }
  async create(createRoomDto: CreateRoomDto) {
    //Establecer el limite de piso 
    // y el formato de numero para la habitacion  

    let limitRoom = 4
    let formatRoom = parseInt(`${createRoomDto.piso}01`)
    let maxRoomNumber = formatRoom + limitRoom - 1


    //Contar habitaciones

    const roomCount = await this.roomRepository.count({
      where: { piso: createRoomDto.piso }
    })

    if (roomCount >= limitRoom) {
      return {
        message: `Limite de habitaciones en el piso ${createRoomDto.piso} alcanzado`
      }
    }


    if (createRoomDto.numero < formatRoom || createRoomDto.numero > maxRoomNumber) {
      throw new NotFoundException(`Numero fuera de rango, debe estar entre ${formatRoom} y ${maxRoomNumber}`)
    }

    //Verificar si la habitacion ya se encuentra registrada

    const existeHabitacion = await this.roomRepository.findOne({
      where: {
        piso: createRoomDto.piso,
        numero: createRoomDto.numero
      }

    })

    if (existeHabitacion) {
      return {
        message: 'Habitacion existente'
      }
    }



    const newRoom = this.roomRepository.create(createRoomDto)

    return this.roomRepository.save(newRoom)

  }

  //otener las habitaciones disponibles
  async findDisponibles(): Promise<Room[]> {

    const rooms = this.roomRepository.find({
      where: { estado: 'disponible' }
    })

    if (!rooms) {
      throw new NotFoundException()
    }
    return rooms
  }
async findAll(): Promise<Room[]> {
  try {
    const rooms = await this.roomRepository.find();

    if (rooms.length === 0) {
      throw new NotFoundException('Lista de habitaciones vacía');
    }

    return rooms;

  } catch (error) {
    console.error('Error al obtener habitaciones:', error);

    throw new InternalServerErrorException('Error interno al obtener habitaciones');
  }
}


  async findOne(id: number) {

    try {
      const room = await this.roomRepository.findOne({
        where: { id }
      })

      if (!room) {
        throw new NotFoundException(`No se encontro la habitación con ID ${id}`)
      }
      return room

    } catch (error) {
      console.error('Error al buscar la habitación ', error)
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new NotFoundException('Error interno del servidor')

    }

  }

  async update(id: number, updateRoomDto: Partial<CreateRoomDto>) {

    try {
      const room = await this.roomRepository.findOne({ where: { id } })
      if (!room) {
        throw new NotFoundException(`No se encontro la habitación con ID ${id}`)

      }
      //Aplicar actualizacion

      await this.roomRepository.update(id, updateRoomDto)
      //Devolver habitación actualizada
      return this.findOne(id)


    } catch (error) {

      console.error('Error al actualizar la habitacion ', error)

      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Error interno del servidor')

    }
  }

 
}
