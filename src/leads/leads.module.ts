import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadEntity } from 'src/entities/entity.leads';
import { OffersEntity } from 'src/entities/entity.offers';

@Module({
  imports: [TypeOrmModule.forFeature([LeadEntity, OffersEntity])],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
