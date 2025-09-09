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
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserType } from "src/lib";

export class RegisterUserDto {
  @ApiProperty({
    description: "User's first name",
    example: "John",
  })
  @IsNotEmpty({ message: "Please provide your firstname" })
  firstname: string;

  @ApiProperty({
    description: "User's last name",
    example: "Doe",
  })
  @IsNotEmpty({ message: "Please provide your lastname" })
  lastname: string;

  @ApiProperty({
    description: "Valid email address of the user",
    example: "john.doe@example.com",
  })
  @IsNotEmpty({ message: "Please provide your email" })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Valid phone number of the user, including country code",
    example: "+2348012345678",
  })
  @IsNotEmpty({ message: "Please provide your phone number" })
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({
    description:
      "Strong password with at least 8 characters, including uppercase, lowercase, number, and special character",
    example: "StrongP@ssw0rd",
  })
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

  @ApiPropertyOptional({
    description: `Type of user. Options: ${Object.values(UserType).join(", ")}`,
    enum: UserType,
    example: UserType.SUPER_ADMIN,
  })
  @IsOptional()
  @IsEnum(UserType, {
    message: `user type can only be one of: ${Object.values(UserType).join(", ")}`,
  })
  user_type?: UserType;
}

export class LoginUserDto {
  @ApiProperty({
    description: "Registered email of the user",
    example: "john.doe@example.com",
  })
  @IsNotEmpty({ message: "Please provide your email" })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password for the given account",
    example: "StrongP@ssw0rd",
  })
  @IsNotEmpty({ message: "Please provide your password" })
  @Length(8, undefined, {
    message: "Please provide a password with at least 8 characters",
  })
  password: string;
}
