import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from 'src/entities/entity.clients';
import { ProjectEntity } from 'src/entities/entity.projects';
import { QuoteEntity } from 'src/entities/entity.quotes';
import { CustomerEntity } from 'src/entities/entity.customer';
import { LeadEntity } from 'src/entities/entity.leads';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientEntity,
      ProjectEntity,
      QuoteEntity,
      CustomerEntity,
      LeadEntity,
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
