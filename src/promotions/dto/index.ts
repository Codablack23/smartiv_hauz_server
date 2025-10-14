/* eslint-disable prettier/prettier */

import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PromotionType } from "src/lib";

export class AddPromotionDto {
  @ApiProperty({
    description: "Caption text for the promotion, typically a short catchy line.",
    example: "Unbelievable Summer Deals!",
  })
  @IsNotEmpty({ message: "Please provide a caption for the promotion." })
  caption: string;

 @ApiProperty({
    description: "Body text for the promotion, typically a long blog post",
    example: "Unbelievable Summer Deals!",
  })
  @IsNotEmpty({ message: "Please provide content for the promotion." })
  content: string;

  @ApiProperty({
    description: "Title of the promotion, often used as the main header.",
    example: "Summer Mega Sale 2025",
  })
  @IsNotEmpty({ message: "Please provide a title for the promotion." })
  title: string;

  @ApiProperty({
    description: "Button text for the promotion (call-to-action).",
    example: "Shop Now",
  })
  @IsNotEmpty({ message: "Please provide a button title." })
  button_title: string;

  @ApiProperty({
    description: "URL of the banner image for the promotion.",
    example: "https://example.com/images/promo-banner.jpg",
  })
  @IsNotEmpty({ message: "Please provide a banner URL." })
  @IsUrl({}, { message: "Please provide a valid URL for the banner." })
  banner_url: string;

  @ApiProperty({
    description: "Type of promotion, defines the promotion category.",
    enum: PromotionType,
    example: PromotionType.WEB_DEVELOPMENT,
  })
  @IsNotEmpty({ message: "Please provide a promotion type." })
  @IsEnum(PromotionType, {
    message: `Promotion type must be one of: ${Object.values(PromotionType).join(", ")}.`,
  })
  promotion_type: PromotionType;
}
/**
 * Custom validator to ensure at least one property is provided
 */
@ValidatorConstraint({ name: "AtLeastOneField", async: false })
class AtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as Record<string, any>;
    return Object.values(object).some(
      (value) => value !== undefined && value !== null,
    );
  }

  defaultMessage(): string {
    return "At least one property must be provided to update the promotion.";
  }
}

export class UpdatePromotionDto {
  @Validate(AtLeastOneFieldConstraint)
  private readonly _: string; // dummy field to attach the class-level validator

  @ApiPropertyOptional({
    description: "Caption text for the promotion, typically a short catchy line.",
    example: "Unbelievable Summer Deals!",
  })
  @IsOptional()
  @IsString({ message: "Caption must be a string." })
  caption?: string;
  
  @ApiPropertyOptional({
    description: "Body text for the promotion, typically a long rich content",
    example: "Unbelievable Summer Deals!",
  })
  @IsOptional()
  @IsString({ message: "Content must be a string." })
  content?: string;

  @ApiPropertyOptional({
    description: "Title of the promotion, often used as the main header.",
    example: "Summer Mega Sale 2025",
  })
  @IsOptional()
  @IsString({ message: "Title must be a string." })
  title?: string;

  @ApiPropertyOptional({
    description: "Button text for the promotion (call-to-action).",
    example: "Shop Now",
  })
  @IsOptional()
  @IsString({ message: "Button title must be a string." })
  button_title?: string;

  @ApiPropertyOptional({
    description: "URL of the banner image for the promotion.",
    example: "https://example.com/images/promo-banner.jpg",
  })
  @IsOptional()
  @IsUrl({}, { message: "Please provide a valid URL for the banner." })
  banner_url?: string;
}
