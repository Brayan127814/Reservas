import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { HuespedesService } from 'src/huespedes/huespedes.service';
import { RoomsModule } from 'src/rooms/rooms.module';
import { HuespedesModule } from 'src/huespedes/huespedes.module';
import { Room } from 'src/rooms/entities/room.entity';
import { Huespedes } from 'src/huespedes/entities/huespede.entity';

@Module({


  imports: [
    TypeOrmModule.forFeature([Reserva,Room,Huespedes]),

  ],

  controllers: [ReservasController],
  providers: [ReservasService, RoomsService, HuespedesService],
  exports: [ReservasService]
})
export class ReservasModule { }
