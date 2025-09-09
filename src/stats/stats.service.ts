import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from 'src/entities/entity.clients';
import { ProjectEntity, ProjectStatus } from 'src/entities/entity.projects';
import { QuoteEntity } from 'src/entities/entity.quotes';
import { AppResponse } from 'src/lib';
import { Repository } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>,
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(QuoteEntity)
    private quoteRepository: Repository<QuoteEntity>,
  ) {}

  async getStats() {
    const [
      total_projects,
      pending_projects,
      total_clients,
      total_quote_requests,
    ] = await Promise.all([
      this.projectRepository.count(),
      this.projectRepository.count({
        where: { status: ProjectStatus.PENDING },
      }),
      this.clientRepository.count(),
      this.quoteRepository.count(),
    ]);

    return AppResponse.getResponse('success', {
      data: {
        total_clients,
        total_projects,
        total_quote_requests,
        pending_projects,
      },
      message: 'Stats retrieved successfully',
    });
  }
}
