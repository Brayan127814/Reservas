import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { ReservasService } from 'src/reservas/reservas.service';
import { ReservasModule } from 'src/reservas/reservas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]),
    ],
  controllers: [RoomsController],
  providers: [RoomsService],

})
export class RoomsModule { }
