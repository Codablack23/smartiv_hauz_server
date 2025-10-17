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
import { ProjectEntity } from "./entity.projects";

@Entity({ name: "clients" })
export class ClientEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext",{unique:true})
    company_name: string    
    
    @Column("longtext",{unique:true,nullable:true})
    company_email: string

    @Column("longtext")
    company_logo: string

    @Column("longtext",{nullable:true})
    company_website?: string

    @OneToMany(()=>ProjectEntity,(project)=>project.client)
    projects:ProjectEntity[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
} 