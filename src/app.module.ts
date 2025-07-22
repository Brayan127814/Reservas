import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HuespedesModule } from './huespedes/huespedes.module';
import { RolModule } from './rol/rol.module';

import { Huespedes } from './huespedes/entities/huespede.entity';
import { Rol } from './rol/entities/rol.entities';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReservasModule } from './reservas/reservas.module';
import { Reserva } from './reservas/entities/reserva.entity';
import { Room } from './rooms/entities/room.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService: ConfigService)=>({
        type:'mysql',
        host: configService.get<string>('BD_HOST'),
        username:configService.get<string>('BD_USER'),
        port:configService.get<number>('BD_PORT'),
        password: configService.get<string>('BD_PASSWORD'),
        database: configService.get<string>('BD_NAME'),
        entities:[Huespedes,Rol,Reserva,Room],
        synchronize:true
      })
    }),
    ScheduleModule.forRoot(),
    HuespedesModule,
    RolModule,
    AuthModule,
    RoomsModule,
    ReservasModule
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule { }
