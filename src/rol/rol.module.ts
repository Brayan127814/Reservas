import { Module } from '@nestjs/common';
import { RolService } from './rol.service';

@Module({
  providers: [RolService]
})
export class RolModule {}
