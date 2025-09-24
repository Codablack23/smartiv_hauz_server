/* eslint-disable prettier/prettier */
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate,IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested, IsNumber } from "class-validator";
import { AddonType } from "src/entities/entity.invoice_addon";
import { InvoiceStatus } from "src/entities/entity.invoices";

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
  @IsString()
  @IsOptional()
  product_id: string;

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
  @ApiProperty({ example: "My Company Ltd." })
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @ApiProperty({ example: "Web development project", required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiProperty({ type: String, format: "date", required: false })
  @IsOptional()
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
  @IsDate()
  due_date?: Date;

  @ApiProperty({ type: String, format: "date", required: false })
  @IsOptional()
  @IsDate()
  expires_at?: Date;

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
