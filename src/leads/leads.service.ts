/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LeadEntity } from "src/entities/entity.leads";
import { OffersEntity } from "src/entities/entity.offers";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { AppResponse } from "src/lib";

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(LeadEntity)
    private readonly leadRepository: Repository<LeadEntity>,

    @InjectRepository(OffersEntity)
    private readonly offerRepository: Repository<OffersEntity>,
  ) {}

  /**
   * Create a new lead
   */
  async create(createLeadDto: CreateLeadDto) {
    let offer: OffersEntity | null = null;

    if (createLeadDto.offer) {
      offer = await this.offerRepository.findOne({
        where: { id: createLeadDto.offer },
      });

      if (!offer) {
        throw new NotFoundException(
          AppResponse.getResponse("failed", {
            message: "Offer not found for this lead",
          }),
        );
      }
    }

    const newLead = this.leadRepository.create({
      ...createLeadDto,
      offer:offer ?? undefined,
    });

    const saved = await this.leadRepository.save(newLead);

    return AppResponse.getResponse("success", {
      data: { lead: saved },
      message: "Lead created successfully",
    });
  }

  /**
   * Find all leads with pagination
   */
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [leads, total] = await this.leadRepository.findAndCount({
      relations: ["offer"],
      order: { created_at: "DESC" },
      take: limit,
      skip,
    });

    const total_pages = Math.ceil(total / limit);

    const pagination = {
      page,
      limit,
      total,
      total_pages,
      has_next_page: page < total_pages,
      has_prev_page: page > 1,
      next_page: page < total_pages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    };

    return AppResponse.getResponse("success", {
      data: { leads, pagination },
      message: "Leads retrieved successfully",
    });
  }

  /**
   * Find one lead by ID
   */
  async findOne(id: string) {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ["offer"],
    });

    if (!lead) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", { message: "Lead not found" }),
      );
    }

    return AppResponse.getResponse("success", {
      data: { lead },
      message: "Lead retrieved successfully",
    });
  }

  /**
   * Remove a lead by ID
   */
  async remove(id: string) {
    const lead = await this.leadRepository.findOne({ where: { id } });

    if (!lead) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", { message: "Lead not found" }),
      );
    }

    await this.leadRepository.remove(lead);

    return AppResponse.getResponse("success", {
      message: "Lead removed successfully",
    });
  }
}
