/* eslint-disable prettier/prettier */
import { 
  IsString, 
  IsUrl, 
  IsOptional, 
  IsEnum, 
  IsUUID 
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PromotionType } from "src/lib";
import { ProjectStatus } from "src/entities/entity.projects";

export class CreateProjectDto {
  @ApiProperty({
    description: "Title of the project",
    example: "Luxury Sunglasses E-Commerce Website",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "URL link to the project",
    example: "https://example.com/my-project",
  })
  @IsUrl()
  project_url: string;

  @ApiPropertyOptional({
    description: "Detailed description of the project",
    example: "A luxury e-commerce platform with virtual try-on and AI product recommendation.",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Project type (promotion type)",
    enum: PromotionType,
    example: PromotionType.WEB_DEVELOPMENT,
  })
  @IsEnum(PromotionType)
  project_type: PromotionType;

  @ApiPropertyOptional({
    description: "Current status of the project",
    enum: ProjectStatus,
    default: ProjectStatus.COMPLETED,
    example: ProjectStatus.PENDING,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({
    description: "UUID of the client associated with this project (optional if client not onboarded yet)",
    example: "e3a1c5de-3f68-4c7d-8f5c-2c9c8b44f2f2",
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  clientId?: string;
}
