import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities';
import { JwtStrategy, LocalStrategy } from 'src/providers';
import { JwtModule } from '@nestjs/jwt';
import { ENVIRONMENT, JWT_EXPIRATION } from 'src/config';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: ENVIRONMENT.SECRETS.JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXPIRATION,
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
