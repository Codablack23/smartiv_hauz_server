/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import bcrypt  from 'bcrypt';
import { BadRequestException, Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities';
import { Repository } from 'typeorm';
import { SanitizerProvider } from 'src/lib';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async verifyUser(email:string,password:string){
        const user = await this.userRepository.findOne({ where:{ email }})
        if(!user) throw new BadRequestException("User does not exist");

        const _password = user.password;
        const isPasswordValid = await bcrypt.compare(password,_password)

        if(!isPasswordValid) throw new BadRequestException("Invalid username or password")

        return SanitizerProvider.sanitizeObject(user,["password"])
    }
}
