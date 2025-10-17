import { Controller, Post, Body } from '@nestjs/common';
import { EmailMessagesService } from './email-messages.service';
import {
  BroadCastEmailMessageDto,
  SendEmailMessageDto,
} from './dto/create-email-message.dto';

@Controller('email-messages')
export class EmailMessagesController {
  constructor(private readonly emailMessagesService: EmailMessagesService) {}

  @Post()
  sendEmailMessage(@Body() createEmailMessageDto: SendEmailMessageDto) {
    return this.emailMessagesService.create(createEmailMessageDto);
  }
  @Post('broadcast')
  broadcastEmailMessages(
    @Body() broadcastEmailMessageDto: BroadCastEmailMessageDto,
  ) {
    return this.emailMessagesService.broadcastMessage(broadcastEmailMessageDto);
  }
}
