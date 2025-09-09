import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENVIRONMENT } from 'src/config';
import { UserEntity } from 'src/entities';
import { AppResponse } from 'src/lib';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async seedAdmin() {
    const admin = await this.userRepository.findOne({
      where: {
        email: ENVIRONMENT.SEEDER_ADMIN.EMAIL,
      },
    });
    if (admin) {
      throw new ForbiddenException(
        AppResponse.getResponse('failed', {
          message: 'Default Admin account has already been seeded',
        }),
      );
    }
    const newAdmin = this.userRepository.create({
      email: ENVIRONMENT.SEEDER_ADMIN.EMAIL,
      firstname: ENVIRONMENT.SEEDER_ADMIN.FIRSTNAME,
      lastname: ENVIRONMENT.SEEDER_ADMIN.LASTNAME,
      password: ENVIRONMENT.SEEDER_ADMIN.PASSWORD,
    });

    await this.userRepository.save(newAdmin);

    return AppResponse.getResponse('success', {
      data: {
        email: ENVIRONMENT.SEEDER_ADMIN.EMAIL,
        password: ENVIRONMENT.SEEDER_ADMIN.PASSWORD,
      },
      message: 'Admin Account Seeded successfully',
    });
  }
}
