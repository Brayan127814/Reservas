import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Request as ExpressRequest } from 'express';
import { JwtGuard } from 'src/auth/dto/auth.jwt';
import { JwtAuthGuar } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/Repeticion/guard.rol';
import { Roles } from 'src/decorators/roles.decorators';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) { }
  @UseGuards(JwtAuthGuar)
  @Post('addReserva')
  create(@Body() createReservaDto: CreateReservaDto, @Request() req: ExpressRequest & { user: { id: number, correo: string, rol: number } }) {
    const userId = req.user.id
    console.log('usuarios logueado  ', userId)
    return this.reservasService.create(createReservaDto, userId);
  }
  //Obtener todas las reservas del usuario autenticado
  @UseGuards(JwtAuthGuar,RoleGuard)
  @Roles('Huésped','Admin')
  @Get('allReservation')
  findAll(@Request() req: ExpressRequest & { user: { id: number } }) {
    return this.reservasService.findAll(req.user.id);
  }

  //Cancelar reservas
  @UseGuards(JwtAuthGuar,RoleGuard)
  @Roles('Admin','Huésped')
  @Patch('cancel/:id')  // esto es inválido

  async cancel(@Param('id') id: number, @Request() req: ExpressRequest & { user: { id: number } }) {
    const userId = req.user.id
    return this.reservasService.cancelReservation(id, userId)

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(+id, updateReservaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasService.remove(+id);
  }
}
