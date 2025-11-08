/* eslint-disable prettier/prettier */
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
} from "class-validator";
import { AddonType } from "src/entities/entity.invoice_addon";
import { InvoiceStatus, InvoiceType } from "src/entities/entity.invoices";

export class CreateCustomerDto {
  @ApiProperty({ example: "Acme Corp", description: "Unique company name of the customer" })
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @ApiProperty({ example: "contact@acme.com", description: "Customer email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "John Doe", description: "Name of the customer representative" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "+2348012345678", description: "Customer phone number" })
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

export class InvoiceProductDto {
  @ApiProperty({ example: "Product Title" })
  @IsString()
  title: string;

  @ApiProperty({ example: "prod_12345" })
  @IsOptional()
  @IsString()
  product_id?: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;
}

export class InvoiceAddOnDto {
  @ApiProperty({ example: "VAT" })
  @IsString()
  title: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: AddonType, default: AddonType.percentage })
  @IsEnum(AddonType)
  type: AddonType;
}

export class InvoiceNoteDto {
  @ApiProperty({ example: "This invoice must be paid within 14 days" })
  @IsString()
  text: string;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: "My Company Ltd.", required: false })
  @IsOptional()
  @IsString()
  company_name?: string;

  @ApiProperty({ example: "Web development project", required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus; 
  
  
  @ApiProperty({ enum: InvoiceType, default: InvoiceType.INVOICE })
  @IsOptional()
  @IsEnum(InvoiceType)
  type?: InvoiceType = InvoiceType.INVOICE;

  @ApiProperty({ type: String, format: "date", required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  published_at?: Date;

  @ApiProperty({ example: "John Doe", required: false })
  @IsOptional()
  @IsString()
  billed_to?: string;

  @ApiProperty({ example: "USD", required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: "https://logo.url", required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ type: String, format: "date", required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  due_date?: Date;

  @ApiProperty({ type: String, format: "date", required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expires_at?: Date;

  @ApiProperty({ example: "modern_template", required: false })
  @IsOptional()
  @IsString()
  template_name?: string;

  @ApiProperty({ example: "#FF5733", required: false })
  @IsOptional()
  @IsString()
  theme_color?: string;

  @ApiProperty({ example: "123 Main Street, Lagos", required: false })
  @IsOptional()
  @IsString()
  company_address?: string;

  @ApiProperty({ example: "info@mycompany.com", required: false })
  @IsOptional()
  @IsEmail()
  company_email?: string;

  @ApiProperty({ example: "+2348012345678", required: false })
  @IsOptional()
  @IsString()
  company_phone?: string;

  @ApiProperty({ example: "Zenith Bank", required: false })
  @IsOptional()
  @IsString()
  bank_name?: string;

  @ApiProperty({ example: "058", required: false })
  @IsOptional()
  @IsString()
  bank_code?: string;

  @ApiProperty({ example: "My Company Ltd.", required: false })
  @IsOptional()
  @IsString()
  account_name?: string;

  @ApiProperty({ example: "1234567890", required: false })
  @IsOptional()
  @IsString()
  account_number?: string;


  @ApiProperty({ example: 10000 })
  @IsOptional()
  @IsNumber()
  due_amount?: number;

  @ApiProperty({ type: [InvoiceProductDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceProductDto)
  products?: InvoiceProductDto[];

  @ApiProperty({ type: [InvoiceAddOnDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceAddOnDto)
  addons?: InvoiceAddOnDto[];

  @ApiProperty({ type: [InvoiceNoteDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceNoteDto)
  notes?: InvoiceNoteDto[];
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
