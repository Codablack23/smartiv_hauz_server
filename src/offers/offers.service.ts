/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OffersEntity } from "src/entities/entity.offers";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { UpdateOfferDto } from "./dto/update-offer.dto";
import { AppResponse } from "src/lib"; // assuming you have this

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(OffersEntity)
    private offersRepository: Repository<OffersEntity>,
  ) {}

  async create(dto: CreateOfferDto) {
    const offer = this.offersRepository.create(dto);
    const saved = await this.offersRepository.save(offer);

    return AppResponse.getResponse("success", {
      message: "Offer created successfully",
      data: saved,
    });
  }

  async findAll() {
    const offers = await this.offersRepository.find();
    return AppResponse.getResponse("success", {
      message: "Offers fetched successfully",
      data: {offers},
    });
  }

  async findOne(id: string) {
    const offer = await this.offersRepository.findOne({ where: { id } });
    if (!offer) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", {
          message: `Offer with ID ${id} not found`,
        }),
      );
    }
    return AppResponse.getResponse("success", {
      message: "Offer fetched successfully",
      data: {offer},
    });
  }

  async update(id: string, dto: UpdateOfferDto) {
    const offer = await this.offersRepository.findOne({ where: { id } });
    if (!offer) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", {
          message: `Offer with ID ${id} not found`,
        }),
      );
    }

    Object.assign(offer, dto);
    const updated = await this.offersRepository.save(offer);

    return AppResponse.getResponse("success", {
      message: "Offer updated successfully",
      data: {offer:updated},
    });
  }

  async remove(id: string) {
    const offer = await this.offersRepository.findOne({ where: { id } });
    if (!offer) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", {
          message: `Offer with ID ${id} not found`,
        }),
      );
    }

    await this.offersRepository.remove(offer);

    return AppResponse.getResponse("success", {
      message: "Offer removed successfully",
    });
  }
}
