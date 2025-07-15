import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { HuespedesService } from 'src/huespedes/huespedes.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly huespedService: HuespedesService,
    private readonly jwtService: JwtService
  ) { }

  async login(correo: string, contraseña: string) {
    try {
      const huesped = await this.huespedService.getEmailHuesped(correo)
      if (!huesped) {
        throw new NotFoundException()
      }

      //Comparar contraseñas
      const isMatch = await bcrypt.compare(contraseña, huesped.contraseña)
      if (!isMatch) {
        throw new UnauthorizedException()
      }

      //crear el payload
      const payload = { sub: huesped.id, correo: huesped.correo, rol: huesped.rol.nombre }

      //Generar el token
      const token = this.jwtService.sign(payload)
      return {
        message: 'Exit',
        token: token,
        success: true
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('error interno del servidor')
    }
  }
}

