/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl, IsArray, IsEnum, IsDateString } from "class-validator";
import { PromotionType } from "src/lib";

export class CreateOfferDto {
  @ApiProperty({ example: "Summer Discount" })
  @IsString()
  title: string;

  @ApiProperty({ example: "https://example.com/banner.png" })
  @IsUrl()
  banner_url: string;

  @ApiProperty({ example: "Limited time discount content..." })
  @IsString()
  content: string;

  @ApiProperty({
    example: [PromotionType.APP_DEVELOPMENT],
    enum: PromotionType,
    isArray: true,
  })
  @IsArray()
  @IsEnum(PromotionType, { each: true })
  services: PromotionType[];

  @ApiProperty({ example: "2025-12-31T23:59:59Z" })
  @IsDateString()
  expires_at: string;
}
