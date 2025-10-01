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
import { CustomerTokenEntity } from "./entity.customer_token";

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
    
    @OneToMany(()=>CustomerTokenEntity,(tokens)=>tokens.customer,{cascade:true})
    tokens:CustomerTokenEntity[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
} 