import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Post('addRoom')
  async create(@Body() datos: CreateRoomDto) {
    return this.roomsService.create(datos);
  }

  @Get('disponibles')
  async roomDisponibles(): Promise<Room[]> {
    return await this.roomsService.findDisponibles()
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: Partial<UpdateRoomDto>) {
    return this.roomsService.update(+id, updateRoomDto);
  }

 
}
