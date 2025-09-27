/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { InvoiceProductEntity } from "./entity.invoice_products";
import { InvoiceAddOnEntity } from "./entity.invoice_addon";
import { InvoiceNoteEntity } from "./entity.invoice_notes";
import { CustomerEntity } from "./entity.customer";

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

@Entity({ name: "invoices" })
export class InvoiceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  company_name: string;
  
  @Column({ type: "varchar", length: 255,nullable:true  })
  template_name?: string;
  
  @Column({ type: "varchar", length: 255,nullable:true  })
  theme_color?: string;
  
  @Column({ type: "varchar", length: 255,nullable:true  })
  company_address?: string;
  
  @Column({ type: "varchar", length: 255,nullable:true  })
  company_email?: string;
  
  @Column({ type: "varchar", length: 255,nullable:true })
  company_phone?: string;
  
  @Column({ type: "varchar", length: 255,nullable:true  })
  bank_name?: string;
  
  @Column({ type: "varchar", length: 255,nullable:true  })
  bank_code?: string;
  
  @Column({ type: "varchar", length: 255,nullable:true })
  account_name: string;
  
  @Column({ type: "varchar", length: 255,nullable:true  })
  account_number: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  subject: string;

  @Column({ type: "enum", enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ type: "date", nullable: true })
  published_at: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  billed_to: string;

  @Column({ type: "varchar", length: 3, nullable: true })
  currency: string;

  @Column({ type: "text", nullable: true })
  logo: string;

  @Column({ type: "date", nullable: true })
  due_date: Date;

  @Column({ type: "date", nullable: true })
  expires_at: Date;

  @OneToMany(() => InvoiceProductEntity, (product) => product.invoice, { cascade: true })
  products: InvoiceProductEntity[];

  @OneToMany(() => InvoiceAddOnEntity, (addon) => addon.invoice, { cascade: true })
  addons: InvoiceAddOnEntity[];

  @OneToMany(() => InvoiceNoteEntity, (note) => note.invoice, { cascade: true })
  notes: InvoiceNoteEntity[];

  @ManyToOne(() => CustomerEntity, (customer) => customer.invoices, { nullable: false })
  @JoinColumn()
  customer: CustomerEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
