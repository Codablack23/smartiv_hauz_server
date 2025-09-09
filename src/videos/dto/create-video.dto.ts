/* eslint-disable prettier/prettier */
import { 
  IsString, 
  IsUrl, 
  IsInt, 
  IsBoolean, 
  IsOptional, 
  IsArray, 
  IsEnum 
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PromotionType } from "src/lib";

export class CreateVideoDto {
  @ApiProperty({
    description: "Title of the video",
    example: "How to scale a NestJS project",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "Banner image URL for the video",
    example: "https://example.com/banner.png",
  })
  @IsUrl()
  banner_url: string;

  @ApiProperty({
    description: "Video file URL",
    example: "https://example.com/video.mp4",
  })
  @IsUrl()
  video_url: string;

  @ApiProperty({
    description: "Duration of the video in seconds",
    example: 3600,
  })
  @IsInt()
  duration: number;

  @ApiPropertyOptional({
    description: "Whether the video is featured",
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;

  @ApiPropertyOptional({
    description: "Short description of the video",
    example: "This tutorial explains how to build scalable APIs with NestJS.",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "List of services this video applies to",
    enum: PromotionType,
    isArray: true,
    example: [PromotionType.APP_DEVELOPMENT, PromotionType.WEB_DEVELOPMENT],
  })
  @IsArray()
  @IsEnum(PromotionType, { each: true })
  services: PromotionType[];
}
