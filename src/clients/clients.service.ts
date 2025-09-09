/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientEntity } from "src/entities/entity.clients";
import { CreateClientDto, UpdateClientDto } from "./dto/create-client.dto";
import { AppResponse, SanitizerProvider } from "src/lib";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    // check if company already exists
    const existing = await this.clientRepository.findOne({
      where: { company_name: createClientDto.company_name },
    });

    if (existing) {
      throw new BadRequestException(
        AppResponse.getResponse("failed", {
          message: "A client with this company name already exists",
        }),
      );
    }

    const newClient = this.clientRepository.create(createClientDto);
    const client = await this.clientRepository.save(newClient);

    return AppResponse.getResponse("success", {
      data: { client },
      message: "Client created successfully",
    });
  }

  async findAll() {
    const clients = await this.clientRepository.find({
      relations: ["projects"],
      order: { created_at: "DESC" },
    });

    return AppResponse.getResponse("success", {
      data: { clients },
      message: "Clients retrieved successfully",
    });
  }

  async findOne(id: string) {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ["projects"],
    });

    if (!client) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", {
          message:
            "The client you are looking for does not exist or may have been removed",
        }),
      );
    }

    return AppResponse.getResponse("success", {
      data: { client },
      message: "Client retrieved successfully",
    });
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const { data } = await this.findOne(id);
    const client = data?.client;

    if (!client) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", {
          message: "Client not found",
        }),
      );
    }

    // sanitize incoming data
    const sanitized = SanitizerProvider.sanitizeEmptyObjectProp(updateClientDto);

    // enforce uniqueness for company_name if updated
    if (sanitized.company_name && sanitized.company_name !== client.company_name) {
      const duplicate = await this.clientRepository.findOne({
        where: { company_name: sanitized.company_name },
      });
      if (duplicate) {
        throw new BadRequestException(
          AppResponse.getResponse("failed", {
            message: "A client with this company name already exists",
          }),
        );
      }
      client.company_name = sanitized.company_name;
    }

    if (sanitized.company_logo !== undefined)
      client.company_logo = sanitized.company_logo;
    if (sanitized.company_website !== undefined)
      client.company_website = sanitized.company_website;

    const updatedClient = await this.clientRepository.save(client);

    return AppResponse.getResponse("success", {
      data: { client: updatedClient },
      message: `Client #${id} updated successfully`,
    });
  }

  async remove(id: string) {
    const { data } = await this.findOne(id);
    const client = data?.client;

    if (!client) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", {
          message: "Client not found",
        }),
      );
    }

    await this.clientRepository.delete(id);

    return AppResponse.getResponse("success", {
      message: "Client deleted successfully",
    });
  }
}
