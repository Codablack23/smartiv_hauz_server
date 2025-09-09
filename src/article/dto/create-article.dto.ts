import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PromotionType } from 'src/lib';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Title of the article',
    example: 'How to Build Scalable APIs with NestJS',
    minLength: 3,
  })
  @IsNotEmpty({ message: 'Please provide an article title' })
  @Length(3, undefined, {
    message: 'Please provide an article with atleast 3 characters',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content of the article',
    example:
      'In this article, we will explore how to design and build scalable APIs with NestJS...',
    minLength: 15,
  })
  @IsNotEmpty({ message: 'Please provide an article content' })
  @Length(15, undefined, {
    message: 'Please provide an article with atleast 15 characters',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Banner image URL for the article',
    example: 'https://example.com/uploads/article-banner.png',
  })
  @IsNotEmpty({ message: 'Please provide an article image' })
  @IsUrl()
  banner_url: string;

  @ApiProperty({
    description: 'List of services associated with this article',
    enum: PromotionType,
    isArray: true,
    example: ['WEB_DEVELOPMENT', 'DIGITAL_MARKETING'],
  })
  @IsArray()
  @IsEnum(PromotionType, { each: true })
  services: PromotionType[];
}
