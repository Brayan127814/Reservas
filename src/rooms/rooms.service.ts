import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

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

    //Contar habitaciones

    const roomCount = await this.roomRepository.count({
      where: { piso: createRoomDto.piso }
    })

    if (roomCount >= maxRoomNumber) {
      return {
        message: `Limite de habitaciones en el piso ${createRoomDto.piso} alcanzado`
      }
    }


    const newRoom =  this.roomRepository.create(createRoomDto)

    return this.roomRepository.save(newRoom)

  }

  findAll() {
    return `This action returns all rooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
