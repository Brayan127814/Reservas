import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HuespedesService } from './huespedes.service';
import { CreateHuespedeDto } from './dto/create-huespede.dto';
import { UpdateHuespedeDto } from './dto/update-huespede.dto';
import { Huespedes } from './entities/huespede.entity';
import { get } from 'http';
import { JwtGuard } from 'src/auth/dto/auth.jwt';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';

@Controller('huesped')
export class HuespedesController {
  constructor(private readonly huespedesService: HuespedesService) {}

  @UseGuards(JwtGuard,RolesGuard)
  @Roles('admin','recepcionista')
  
  @Post('addHuesped')
  create(@Body() createHuespedeDto: CreateHuespedeDto) {
    return this.huespedesService.create(createHuespedeDto);
  }

  @Get()
  findAll() {
    return this.huespedesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.huespedesService.findOne(+id);
  }

  @Patch(':id')
  
  update(@Param('id') id: string, @Body() datos:Partial<Huespedes>) {
    return this.huespedesService.update(+id, datos);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.huespedesService.remove(+id);
  }
}
