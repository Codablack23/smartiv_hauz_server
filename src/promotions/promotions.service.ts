/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionEntity } from 'src/entities/entity.promotions';
import { AppResponse, PromotionType } from 'src/lib';
import { Repository } from 'typeorm';
import { AddPromotionDto, UpdatePromotionDto } from './dto';

@Injectable()
export class PromotionsService {

    constructor(
        @InjectRepository(PromotionEntity)
        private readonly promtionRepository: Repository<PromotionEntity>
    ) { }



    async getPromotions(promotion_type: PromotionType) {
        const promotion = await this.promtionRepository.findOne({ where: { promotion_type } })

        if (!promotion) {
            throw new NotFoundException(
                AppResponse.getResponse("failed", {
                    message: "The Promotion you are looking for does not exist or have been deleted"
                }))
        }
        return AppResponse.getResponse("success", {
            data: {
                promotion
            },
            message: "Promotion retrieved successfully"
        })
    }
    async addPromotion(promotionDto: AddPromotionDto) {
        const promotion = await this.promtionRepository.findOne({ where: { promotion_type: promotionDto.promotion_type } })

        if (promotion) throw new BadRequestException(
            AppResponse.getResponse("failed", {
                message: "Promotion type already exists please provide a unique promotion type"
            })
        )

        const promotionInstance = this.promtionRepository.create(promotionDto)
        await this.promtionRepository.save(promotionInstance);

        return AppResponse.getResponse("success", {
            data: {
                promotion: promotionDto,
            },
             message: "Promotion Added Successfully"
        })
    }
    async updatePromotion(promotionId: string, promotionDto: UpdatePromotionDto) {
        const promotion = await this.promtionRepository.findOne({ where: { id: promotionId } })

        if (!promotion) throw new BadRequestException(
            AppResponse.getResponse("failed", {
                message: "Promotion does not exist"
            })
        )

        if (promotionDto.banner_url) {
            promotion.banner_url = promotionDto.banner_url
        }
        if (promotionDto.caption) {
            promotion.caption = promotionDto.caption
        }
        if (promotionDto.title) {
            promotion.title = promotionDto.title
        }
        if (promotionDto.button_title) {
            promotion.button_title = promotionDto.button_title
        }

        await this.promtionRepository.save(promotion);

        return AppResponse.getResponse("success", {
            data: {
                promotion: promotionDto,
            },
            message: "Promotion updated successfully"
        })
    }
    async deletePromotion(promotionId: string) {
        const promotion = await this.promtionRepository.findOne({ where: { id: promotionId } })

        if (!promotion) throw new BadRequestException(
            AppResponse.getResponse("failed", {
                message: "Promotion does not exist"
            })
        )

        await this.promtionRepository.delete(promotion);

        return AppResponse.getResponse("success", {
            message: "Promotion deleted successfully"
        })
    }
}
