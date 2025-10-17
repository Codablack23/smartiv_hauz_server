/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class CreateResourceDto {
  @ApiProperty({
    description: "Title of the resource",
    example: "Getting Started with Our API",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "URL to the banner image",
    example: "https://cdn.example.com/banners/api-guide.png",
  })
  @IsUrl()
  @IsNotEmpty()
  banner_url: string;

  @ApiProperty({
    description: "Direct URL to the downloadable or viewable file",
    example: "https://cdn.example.com/resources/api-guide.pdf",
  })
  @IsUrl()
  @IsNotEmpty()
  file_url: string;

  @ApiPropertyOptional({
    description: "Brief description of the resource",
    example: "This guide helps you integrate with our REST API.",
  })
  @IsString()
  @IsOptional()
  description?: string;
}
