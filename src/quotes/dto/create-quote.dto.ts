/* eslint-disable prettier/prettier */
import { IsArray, IsEmail, IsNotEmpty, IsString, IsEnum } from "class-validator";
import { PromotionType } from "src/lib";
import { ApiProperty } from "@nestjs/swagger";

export class CreateQuoteDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+2348012345678" })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ enum: PromotionType, isArray: true })
  @IsArray()
  @IsEnum(PromotionType, { each: true })
  services: PromotionType[];
}

import { PartialType } from "@nestjs/swagger";

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {}
