/* eslint-disable prettier/prettier */
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PromotionType, SanitizerProvider } from "src/lib";
import { LeadEntity } from "./entity.leads";

@Entity({ name: "offers" })
export class OffersEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext")
    title: string

    @Column("longtext")
    banner_url: string

    @Column("longtext")
    slug: string

    @Column("longtext")
    content: string

    @Column({ type: "json", nullable: false })
    services: PromotionType[]

    @Column({type:"datetime"})
    expires_at:Date

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @OneToMany(()=>LeadEntity,(lead)=>lead.offer,{cascade:true})
    leads:LeadEntity[]

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (this.title) {
            this.slug = SanitizerProvider.generateSlug(this.title)       // trim - from start/end
        }
    }

} 