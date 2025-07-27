import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuar } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Rol } from 'src/rol/entities/rol.entities';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) { }
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Roles('Admin', 'recepcionista', 'Huésped')
  @Post('addReserva')
  create(@Body() createReservaDto: CreateReservaDto, @Request() req: ExpressRequest & { user: { id: number, correo: string, rol: number } }) {
    const userId = req.user.id
    console.log('usuarios logueado  ', userId)
    return this.reservasService.create(createReservaDto, userId);
  }
  //Obtener todas las reservas del usuario autenticado
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Roles('Huésped', 'Admin', 'recepcionista')
  @Get('allReservation')
  findAll(@Request() req: ExpressRequest & { user: { id: number, rol: string } }) {
    console.log(req.user.rol)
    return this.reservasService.findAll(req.user.id, req.user.rol);
  }


  //Cancelar reservas
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Roles('Admin', 'Huésped', 'recepcionista')
  @Patch('cancel/:id')  // esto es inválido
  async cancel(@Param('id') id: number, @Request() req: ExpressRequest & { user: { id: number, rol: string } }) {
    const userId = req.user.id
    const rol = req.user.rol

    return this.reservasService.cancelReservation(id, userId, rol)

  }
  //Obtener una reserva
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Roles('Admin', 'Huésped', 'recepcionista')
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: ExpressRequest & { user: { id: number, rol: string } }) {

    const userID = req.user.id
    const rol = req.user.rol
    console.log(rol)
    return this.reservasService.findOne(+id, userID, rol)

  }
  //Actualizar una reserva
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Roles('Admin', 'Huésped', 'recepcionista')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto, @Request() req: ExpressRequest & { user: { id: number, rol: string } }) {
    let userId = req.user.id
    let rol = req.user.rol
    return this.reservasService.update(+id, updateReservaDto, userId, rol);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasService.remove(+id);
  }
}
