/* eslint-disable prettier/prettier */
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
} from "typeorm";
import { OffersEntity } from "./entity.offers";


export enum LeadSource{
    PROMOTIONS="PROMOTIONS",
    OFFERS="OFFERS"
}

@Entity({ name: "leads" })
export class LeadEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext")
    company_name: string

    @Column("longtext")
    email: string

    @Column("longtext")
    name: string  
    
    @ManyToOne(()=>OffersEntity,(offer)=>offer.leads,{onDelete:"SET NULL",nullable:true})
    offer?:OffersEntity
    
    @Column("json",{nullable:true})
    services?: string[]
    
    @Column({type:"enum",enum:LeadSource,default:LeadSource.PROMOTIONS})
    source: LeadSource    
    
    @Column("longtext")
    phone_number: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}