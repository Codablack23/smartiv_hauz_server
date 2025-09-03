/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionType } from 'src/lib';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { AddPromotionDto, UpdatePromotionDto } from './dto';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @ApiQuery({ name: 'promotion_type', enum: PromotionType })
  getPromotion(@Query("promotion_type") query:PromotionType){
    return this.promotionsService.getPromotions(query)
  }  
  
  @Post()
  addPromotion(@Body() addPromotionDto:AddPromotionDto){
    return this.promotionsService.addPromotion(addPromotionDto)
  }
  
  @Patch(":id")
  @ApiParam({ name: 'id', type:"string",example:"abcd-123456789"})
  updatePromotion(@Param("id") promotionId:string,@Body() updatePromotionDto:UpdatePromotionDto){
    return this.promotionsService.updatePromotion(promotionId,updatePromotionDto)
  }
  @Delete(":id")
  @ApiParam({ name: 'id', type:"string",example:"abcd-123456789"})
  deletePromotion(@Param("id") promotionId:string){
    return this.promotionsService.deletePromotion(promotionId)
  }
}
