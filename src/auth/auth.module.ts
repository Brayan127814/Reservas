import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HuespedesModule } from 'src/huespedes/huespedes.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtStrategy } from './jwtAuth.strategy';

@Module({
  imports: [
   HuespedesModule,
   ConfigModule,
   JwtModule.registerAsync({
     imports:[ConfigModule],
     inject:[ConfigService],
     useFactory : async (configService:ConfigService)=>({
      global: true,
      secret: configService.get<string>("SECRETKEY"),
      signOptions:{expiresIn:'1h'}
     })
   
   })
  
  ],
  controllers: [AuthController],
  providers: [AuthService,jwtStrategy],

})
export class AuthModule { }
