import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum EmailMessageTarget {
  CUSTOMERS = 'customers',
  CLIENTS = 'clients',
  TEAM_MEMBERS = 'team_members',
}

export class SendEmailMessageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Subject of the email being sent',
    example: 'A new Message',
  })
  subject: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Main content or body of the email (rich text supported)',
    example: '<p>Hello! This is the message body.</p>',
  })
  body: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'List of email addresses to send this message to',
    example: ['user1@example.com', 'user2@example.com'],
  })
  receivers: string[];
}

export class BroadCastEmailMessageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Subject of the broadcast email',
    example: 'A new Announcement',
  })
  subject: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Main body of the broadcast email (rich text supported)',
    example: '<p>We have exciting news for all our customers!</p>',
  })
  body: string;

  @IsOptional()
  @Transform(({ value }: { value: string[] }) =>
    Array.isArray(value) ? value : [value],
  )
  @IsArray()
  @IsEnum(EmailMessageTarget, { each: true })
  @ApiProperty({
    description: 'Target groups that will receive this broadcast email',
    enum: EmailMessageTarget,
    isArray: true,
    example: ['customers', 'team_members'],
  })
  target: EmailMessageTarget[] = [EmailMessageTarget.CUSTOMERS];
}
