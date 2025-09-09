import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteEntity } from 'src/entities/entity.quotes';

@Module({
  imports: [TypeOrmModule.forFeature([QuoteEntity])],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
