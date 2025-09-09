/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import bcrypt  from 'bcrypt';
import { BadRequestException, Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities';
import { Repository } from 'typeorm';
import { AppResponse, SanitizerProvider } from 'src/lib';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService:JwtService,
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

    async loginUser(user:any){
        const access_token = this.jwtService.sign(user)
        return AppResponse.getResponse("success",{
            data:{
                access_token,
                user
            },
            message:"login successful"

        })
    }
}
