/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionType } from 'src/lib';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AddPromotionDto, UpdatePromotionDto } from './dto';
import { JwtAuthGuard } from 'src/providers';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) { }

  @Get()
  @ApiQuery({ name: 'promotion_type', enum: PromotionType })
  getPromotions(@Query("promotion_type") query: PromotionType) {
    return this.promotionsService.getPromotions(query)
  } 
  
  @Get(":promotion_type")
  @ApiParam({ name: 'promotion_type', enum: PromotionType })
  getPromotion(@Param("promotion_type") promotion_type: PromotionType) {
    return this.promotionsService.getPromotion(promotion_type)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  addPromotion(@Body() addPromotionDto: AddPromotionDto) {
    return this.promotionsService.addPromotion(addPromotionDto)
  }

  @Patch(":id")

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: "string", example: "abcd-123456789" })
  updatePromotion(@Param("id") promotionId: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionsService.updatePromotion(promotionId, updatePromotionDto)
  }
  @Delete(":id")

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: "string", example: "abcd-123456789" })
  deletePromotion(@Param("id") promotionId: string) {
    return this.promotionsService.deletePromotion(promotionId)
  }
}
