import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { OffersEntity } from 'src/entities/entity.offers';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OffersEntity])],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
