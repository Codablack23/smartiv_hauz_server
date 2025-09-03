/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsStrongPassword,
  Length,
} from "class-validator";
import { UserType } from "src/lib";

export class RegisterUserDto {
  @IsNotEmpty({ message: "Please provide your firstname" })
  firstname: string;

  @IsNotEmpty({ message: "Please provide your lastname" })
  lastname: string;

  @IsNotEmpty({ message: "Please provide your email" })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Please provide your phone number" })
  @IsPhoneNumber()
  phone_number: string;

  @IsNotEmpty({ message: "Please provide your password" })
  @Length(8, undefined, {
    message: "Please provide a password with at least 8 characters",
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
    }
  )
  password: string;

  @IsOptional()
  @IsEnum(UserType, {
    message: `user type can only be one of: ${Object.values(UserType).join(
      ", "
    )}`,
  })
  user_type?: UserType;
}

export class LoginUserDto {
  @IsNotEmpty({ message: "Please provide your email" })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Please provide your password" })
  @Length(8, undefined, {
    message: "Please provide a password with at least 8 characters",
  })
  password: string;

}
