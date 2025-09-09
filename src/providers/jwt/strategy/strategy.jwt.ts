/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ENVIRONMENT } from 'src/config';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { SanitizerProvider } from 'src/lib';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENVIRONMENT.SECRETS.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const userAccount = await this.userRepository.findOne({
      where: {
        id: payload?.id,
      },
    });

    if (!userAccount) {
      throw new UnauthorizedException({
        status: 'failed',
        message: 'Invalid user account',
      });
    }

    const user = SanitizerProvider.sanitizeObject(userAccount, ['password']);

    return user;
  }
}
