/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QuoteEntity } from "src/entities/entity.quotes";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { AppResponse, MailProvider } from "src/lib";
import { EmailTemplateProvider } from "src/lib";

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(QuoteEntity)
    private readonly quoteRepository: Repository<QuoteEntity>,
  ) {}

  async create(createQuoteDto: CreateQuoteDto) {
    // const existing = await this.quoteRepository.findOne({ where: { name: createQuoteDto.name } });
    // if (existing) {
    //   throw new BadRequestException(
    //     AppResponse.getResponse("failed", { message: "A quote with this name already exists" }),
    //   );
    // }

    const newQuote = this.quoteRepository.create(createQuoteDto);
    const saved = await this.quoteRepository.save(newQuote);

    const adminHtmlTemplate = EmailTemplateProvider.generateAdminQuoteTemplate(createQuoteDto)
    const userHtml = EmailTemplateProvider.generateUserQuoteReceiverTemplate(createQuoteDto)

    Promise.all([
      MailProvider.sendMail({
        subject:"Quote Received",
        html:adminHtmlTemplate,
        to:["admin@smartivhauz.com"]
      }) ,
      MailProvider.sendMail({
        subject:"Quote Received",
        html:userHtml,
        to:[createQuoteDto.email]
      })
    ]).catch(err=>{
      console.log(`An Error occured could not send templates ${err}`)
    })

    return AppResponse.getResponse("success", {
      data: { quote: saved },
      message: "Quote created successfully",
    });
  }

  async findAll() {
    const quotes = await this.quoteRepository.find();
    return AppResponse.getResponse("success", {
      data: { quotes },
      message: "Quotes retrieved successfully",
    });
  }

  async findOne(id: string) {
    const quote = await this.quoteRepository.findOne({ where: { id } });
    if (!quote) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", { message: "Quote not found" }),
      );
    }
    return AppResponse.getResponse("success", {
      data: { quote },
      message: "Quote retrieved successfully",
    });
  }

  async update(id: string, updateQuoteDto: UpdateQuoteDto) {
    const quote = await this.quoteRepository.findOne({ where: { id } });
    if (!quote) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", { message: "Quote not found" }),
      );
    }

    Object.assign(quote, updateQuoteDto);
    const updated = await this.quoteRepository.save(quote);

    return AppResponse.getResponse("success", {
      data: { quote: updated },
      message: "Quote updated successfully",
    });
  }

  async remove(id: string) {
    const quote = await this.quoteRepository.findOne({ where: { id } });
    if (!quote) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", { message: "Quote not found" }),
      );
    }

    await this.quoteRepository.remove(quote);
    return AppResponse.getResponse("success", {
      message: "Quote removed successfully",
    });
  }
}
