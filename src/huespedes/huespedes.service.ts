import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHuespedeDto } from './dto/create-huespede.dto';
import { UpdateHuespedeDto } from './dto/update-huespede.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Huespedes } from './entities/huespede.entity';
import { Repository } from 'typeorm';
import * as bcryp from 'bcrypt'
@Injectable()
export class HuespedesService {
  constructor(
    @InjectRepository(Huespedes)
    private readonly huespedRepository: Repository<Huespedes>
  ) { }
  async create(createHuespedeDto: CreateHuespedeDto) {
    try {
      const hasPassword = await bcryp.hash(createHuespedeDto.contraseña, 10)
      const newHuesped = this.huespedRepository.create({
        ...createHuespedeDto,
        contraseña: hasPassword
      })

      return this.huespedRepository.save(newHuesped)
    } catch (error) {
      throw new Error(`Error al registrar el huesped ${error.message}`)
    }
  }

  //Obtener el email para el inicio de sesión
  async getEmailHuesped(email: string) {
    try {
      const userEmail = this.huespedRepository.findOne({
        where: { correo: email },
        relations: ['rol']
      })

      if (!userEmail) {
        throw new NotFoundException()
      }
      return userEmail
    } catch (error) {

    }
  }
  //Obtener todos los usuarios
  async findAll(): Promise<Huespedes[]> {
    try {
      const allHuesped = await this.huespedRepository.find({
        relations: ['rol']
      })
      if (allHuesped.length === 0) {
        throw new NotFoundException('Lista vacia')
      }
      return allHuesped

    } catch (error) {
      throw new Error(`Error al obtener huéspedes: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const userHuesped = await this.huespedRepository.findOne({ where: { id } })
      if (!userHuesped) { throw new NotFoundException() }
      return userHuesped
    } catch (error) {
      throw new Error(`error interno ${error.message}`)

    }
  }

  async update(id: number, datos: Partial<Huespedes>) {
    try {
      await this.huespedRepository.update(id, datos)
      return await this.findOne(id)
    } catch (error) {

    }
  }

  remove(id: number) {
    return `This action removes a #${id} huespede`;
  }
}
