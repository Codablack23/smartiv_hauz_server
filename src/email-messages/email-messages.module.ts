import { Module } from '@nestjs/common';
import { EmailMessagesService } from './email-messages.service';
import { EmailMessagesController } from './email-messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/entity.customer';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [EmailMessagesController],
  providers: [EmailMessagesService],
})
export class EmailMessagesModule {}
