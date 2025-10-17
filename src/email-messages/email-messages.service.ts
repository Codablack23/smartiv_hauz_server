import { Injectable, NotFoundException } from '@nestjs/common';
import {
  SendEmailMessageDto,
  BroadCastEmailMessageDto,
  EmailMessageTarget,
} from './dto/create-email-message.dto';
import { AppResponse, EmailTemplateProvider, MailProvider } from 'src/lib';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/entity.customer';
import { Repository } from 'typeorm';

@Injectable()
export class EmailMessagesService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
  ) {}

  async create(dto: SendEmailMessageDto) {
    const html = EmailTemplateProvider.addTemplateHeader(dto.body);

    await MailProvider.sendMail({
      subject: dto.subject,
      html,
      to: dto.receivers,
    });

    return AppResponse.getSuccessResponse({
      message: `Email sent successfully to ${dto.receivers.length} recipient(s).`,
    });
  }

  async broadcastMessage(dto: BroadCastEmailMessageDto) {
    const recipients: string[] = [];

    if (dto.target.includes(EmailMessageTarget.CUSTOMERS)) {
      const customers = await this.customerRepo.find();
      recipients.push(...customers.map((c) => c.email));
    }

    if (!recipients.length) {
      throw new NotFoundException(
        AppResponse.getFailedResponse(
          'No recipients found for the selected target(s)',
        ),
      );
    }

    const html = EmailTemplateProvider.addTemplateHeader(dto.body);

    await MailProvider.sendMail({
      subject: dto.subject,
      html,
      to: recipients,
    });

    return AppResponse.getSuccessResponse({
      message: `Broadcast email sent successfully to ${recipients.length} recipient(s).`,
    });
  }
}
