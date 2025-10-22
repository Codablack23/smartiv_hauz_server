import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';
import { LeadSource } from '../../entities/entity.leads';

export class CreateLeadDto {
  @IsString()
  company_name: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  offer?: string; // FK reference to OffersEntity

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsString()
  phone_number: string;
}
