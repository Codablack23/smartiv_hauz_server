/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Request,Get ,UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard,JwtAuthGuard } from 'src/providers';
import { AppResponse } from 'src/lib';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService:JwtService
  ) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("status")
  getAuthStatus(@Request() req:any) {

    if(!req.user) throw new UnauthorizedException(AppResponse.getResponse("success",{
      message:"Sorry you are not logged in"
    }))

    const access_token = this.jwtService.sign(req.user)

    return {
      status: "success",
      data:{
        user:req.user,
        access_token,
      },
      message: "Auth status retrieved successfully"
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req:any,@Body() loginDto:LoginUserDto) {
    console.log({loginDto})
    return this.authService.loginUser(req.user)
  }

  
}
