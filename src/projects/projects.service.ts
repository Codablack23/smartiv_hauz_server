import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from 'src/entities/entity.projects';
import { ClientEntity } from 'src/entities/entity.clients';
import { AppResponse, SanitizerProvider } from 'src/lib';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,

    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    // generate slug
    const projectSlug = SanitizerProvider.generateSlug(createProjectDto.title);

    // check if project with same slug exists
    const existing = await this.projectRepository.findOne({
      where: { slug: projectSlug },
    });
    if (existing) {
      throw new BadRequestException(
        AppResponse.getResponse('failed', {
          message: 'A project with this title already exists',
        }),
      );
    }

    let client: ClientEntity | null = null;
    if (createProjectDto.clientId) {
      client = await this.clientRepository.findOne({
        where: { id: createProjectDto.clientId },
      });
      if (!client) {
        throw new BadRequestException(
          AppResponse.getResponse('failed', {
            message: 'The provided client does not exist',
          }),
        );
      }
    }

    const newProject = this.projectRepository.create({
      ...createProjectDto,
      slug: projectSlug,
      client: client ?? undefined,
    });

    const project = await this.projectRepository.save(newProject);

    return AppResponse.getResponse('success', {
      data: { project },
      message: 'Project created successfully',
    });
  }

  async findAll() {
    const projects = await this.projectRepository.find({
      relations: ['client'],
      order: { created_at: 'DESC' },
    });

    return AppResponse.getResponse('success', {
      data: { projects },
      message: 'Projects retrieved successfully',
    });
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException(
        AppResponse.getResponse('failed', {
          message:
            'The project you are looking for does not exist or may have been removed',
        }),
      );
    }

    return AppResponse.getResponse('success', {
      data: { project },
      message: 'Project retrieved successfully',
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { data } = await this.findOne(id);
    const project = data?.project;

    if (!project) {
      throw new NotFoundException(
        AppResponse.getResponse('failed', {
          message: 'Project not found',
        }),
      );
    }

    // sanitize incoming object
    const sanitized =
      SanitizerProvider.sanitizeEmptyObjectProp(updateProjectDto);

    // update fields
    if (sanitized.title !== undefined) {
      project.title = sanitized.title;
      project.slug = SanitizerProvider.generateSlug(sanitized.title);
    }
    if (sanitized.project_url !== undefined)
      project.project_url = sanitized.project_url;
    if (sanitized.description !== undefined)
      project.description = sanitized.description;
    if (sanitized.project_type !== undefined)
      project.project_type = sanitized.project_type;
    if (sanitized.status !== undefined) project.status = sanitized.status;

    if (sanitized.clientId !== undefined) {
      if (sanitized.clientId) {
        const client = await this.clientRepository.findOne({
          where: { id: sanitized.clientId },
        });
        if (!client) {
          throw new BadRequestException(
            AppResponse.getResponse('failed', {
              message: 'The provided client does not exist',
            }),
          );
        }
        project.client = client;
      } else {
        // allow removing client
        project.client = undefined;
      }
    }

    const updatedProject = await this.projectRepository.save(project);

    return AppResponse.getResponse('success', {
      data: { project: updatedProject },
      message: `Project #${id} updated successfully`,
    });
  }

  async remove(id: string) {
    const { data } = await this.findOne(id);
    const project = data?.project;

    if (!project) {
      throw new NotFoundException(
        AppResponse.getResponse('failed', {
          message: 'Project not found',
        }),
      );
    }

    await this.projectRepository.delete(id);

    return AppResponse.getResponse('success', {
      message: 'Project deleted successfully',
    });
  }
}
