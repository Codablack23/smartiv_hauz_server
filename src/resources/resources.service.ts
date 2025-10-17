/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ResourceEntity } from "src/entities/entity.resources";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { AppResponse, SanitizerProvider } from "src/lib";

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
  ) {}

  // 🧩 Create new resource
  async create(createResourceDto: CreateResourceDto) {
    const slug = SanitizerProvider.generateSlug(createResourceDto.title);

    // Check for existing resource with same slug
    const existing = await this.resourceRepository.findOne({ where: { slug } });
    if (existing) {
      throw new BadRequestException(
        AppResponse.getResponse("failed", {
          message: "A resource with this title already exists",
        }),
      );
    }

    const resource = this.resourceRepository.create({
      ...createResourceDto,
      slug,
    });

    const saved = await this.resourceRepository.save(resource);

    return AppResponse.getResponse("success", {
      data: { resource: saved },
      message: "Resource created successfully",
    });
  }

  // 📚 Get all resources
  async findAll() {
    const resources = await this.resourceRepository.find({
      order: { created_at: "DESC" },
    });

    return AppResponse.getResponse("success", {
      data: { resources },
      message: "Resources retrieved successfully",
    });
  }

  // 🔍 Get a single resource
  async findOne(id: string) {
    const resource = await this.resourceRepository.findOne({ where: { id } });

    if (!resource) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", {
          message:
            "The resource you are looking for does not exist or may have been removed",
        }),
      );
    }

    return AppResponse.getResponse("success", {
      data: { resource },
      message: "Resource retrieved successfully",
    });
  }

  // ✏️ Update a resource
  async update(id: string, updateResourceDto: UpdateResourceDto) {
    const { data } = await this.findOne(id);
    const resource = data?.resource;

    if (!resource) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", { message: "Resource not found" }),
      );
    }

    const sanitized = SanitizerProvider.sanitizeEmptyObjectProp(updateResourceDto);

    if (sanitized.title !== undefined) {
      resource.title = sanitized.title;
      resource.slug = SanitizerProvider.generateSlug(sanitized.title);
    }
    if (sanitized.banner_url !== undefined)
      resource.banner_url = sanitized.banner_url;
    if (sanitized.file_url !== undefined)
      resource.file_url = sanitized.file_url;
    if (sanitized.description !== undefined)
      resource.description = sanitized.description;

    const updated = await this.resourceRepository.save(resource);

    return AppResponse.getResponse("success", {
      data: { resource: updated },
      message: `Resource #${id} updated successfully`,
    });
  }

  // 🗑️ Delete a resource
  async remove(id: string) {
    const { data } = await this.findOne(id);
    const resource = data?.resource;

    if (!resource) {
      throw new NotFoundException(
        AppResponse.getResponse("failed", { message: "Resource not found" }),
      );
    }

    await this.resourceRepository.delete(id);

    return AppResponse.getResponse("success", {
      message: "Resource deleted successfully",
    });
  }
}
