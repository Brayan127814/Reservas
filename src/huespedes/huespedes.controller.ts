import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HuespedesService } from './huespedes.service';
import { CreateHuespedeDto } from './dto/create-huespede.dto';
import { UpdateHuespedeDto } from './dto/update-huespede.dto';
import { Huespedes } from './entities/huespede.entity';
import { get } from 'http';
import { JwtGuard } from 'src/auth/dto/auth.jwt';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { JwtAuthGuar } from 'src/auth/auth.guard';

@Controller('huesped')
export class HuespedesController {
  constructor(private readonly huespedesService: HuespedesService) { }

  // @UseGuards(JwtGuard,RolesGuard)
  // @Roles('admin','recepcionista')
  /*
  Metodo para regististrar un huesped
  solo la persona con rol de Admin o recepcionista+
  puede registrar un huesped
  */
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Roles('recepcionista', 'Admin')
  @Post('addHuesped')
  create(@Body() createHuespedeDto: CreateHuespedeDto) {
    return this.huespedesService.create(createHuespedeDto);
  }

 /*
Endpoint para obtener todos  los huesped
registrados
 */
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Roles('recepcionista', 'Admin')
  @Get("allHuesped")
  findAll() {
    return this.huespedesService.findAll();
  }
  /*
  Enpoint para buscar un 
  huesped en especifico
  */
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Roles('recepcionista', 'Admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.huespedesService.findOne(+id);
  }

  //Actualizar datos del huesped
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() datos: Partial<Huespedes>) {
    return this.huespedesService.update(+id, datos);
  }
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.huespedesService.remove(+id);
  }
}
