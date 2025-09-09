import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/entities/entity.projects';
import { ClientEntity } from 'src/entities/entity.clients';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, ClientEntity])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
