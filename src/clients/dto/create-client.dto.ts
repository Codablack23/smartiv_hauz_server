/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateClientDto {
  @ApiProperty({
    description: "Unique company name of the client",
    example: "Techify Solutions Ltd.",
  })
  @IsNotEmpty({ message: "Company name is required" })
  @Length(3, 255, { message: "Company name must be at least 3 characters long" })
  @IsString()
  company_name: string; 
  
  @ApiProperty({
    description: "Unique company email of the client",
    example: "Techify Solutions Ltd.",
  })
  @IsNotEmpty({ message: "Company email is required" })
  @Length(3, 255, { message: "Company email must be at least 3 characters long" })
  @IsString()
  @IsEmail()
  company_email: string;

  @ApiProperty({
    description: "Logo URL of the client",
    example: "https://example.com/logo.png",
  })
  @IsNotEmpty({ message: "Company logo is required" })
  @IsUrl({}, { message: "Please provide a valid URL for the logo" })
  company_logo: string;

  @ApiPropertyOptional({
    description: "Website URL of the client (optional)",
    example: "https://example.com",
  })
  @IsOptional()
  @IsUrl({}, { message: "Please provide a valid URL for the website" })
  company_website?: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}
