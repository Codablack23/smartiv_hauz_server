/* eslint-disable prettier/prettier */
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { } from "src/lib";
import { InvoiceEntity } from "./entity.invoices";

@Entity({ name: "invoice_products" })
export class InvoiceProductEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("bigint")
    price: number    
    
    @Column("bigint")
    quantity: number

    @Column("longtext")
    title: string    
    
    @Column("longtext")
    product_id: string

    @ManyToOne(()=>InvoiceEntity,(invoice)=>invoice.products)
    @JoinColumn()
    invoice:InvoiceEntity

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
} 