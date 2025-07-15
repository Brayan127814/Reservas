import { Module } from '@nestjs/common';
import { HuespedesService } from './huespedes.service';
import { HuespedesController } from './huespedes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Huespedes } from './entities/huespede.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Huespedes])
  ],
  controllers: [HuespedesController],
  providers: [HuespedesService],
  exports:[HuespedesService]
})
export class HuespedesModule {}
