/* eslint-disable prettier/prettier */
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { } from "src/lib";
import { InvoiceEntity } from "./entity.invoices";

@Entity({ name: "customers" })
export class CustomerEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext",{unique:true})
    company_name: string

    @Column("longtext")
    email: string

    @Column("longtext")
    name: string    
    
    @Column("longtext")
    phone_number: string

    @OneToMany(()=>InvoiceEntity,(invoices)=>invoices.customer)
    invoices:InvoiceEntity[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
} 