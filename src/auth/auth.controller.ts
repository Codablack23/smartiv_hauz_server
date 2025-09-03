/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("status")
  getAuthStatus() {
    return {
      status: "success",
      message: "login retrieved successfully"
    }
  }
  @Post("login")
  login() {
    return {
      status: "success",
      message: "login retrieved successfully"
    }
  }
}
