/* eslint-disable prettier/prettier */
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PromotionType, SanitizerProvider } from "src/lib";
import { ClientEntity } from "./entity.clients";

export enum ProjectStatus{
    COMPLETED="COMPLETED",
    PENDING="PENDING"
}

@Entity({ name: "projects" })
export class ProjectEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext")
    title: string

    @Column("longtext")
    project_url: string
    
    @Column("longtext")
    banner_url: string

    @Column("longtext")
    slug: string

    @Column("longtext", { nullable: true })
    description?: string

    @Column({ type: "enum", enum:PromotionType})
    project_type: PromotionType
    
    @Column({ type: "enum", enum:ProjectStatus,default:ProjectStatus.COMPLETED})
    status: ProjectStatus

    @CreateDateColumn()
    created_at: Date

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (this.title) {
            this.slug = SanitizerProvider.generateSlug(this.title)       // trim - from start/end
        }
    }

    @ManyToOne(()=>ClientEntity,(client)=>client.projects)
    @JoinColumn()
    client?:ClientEntity

    @UpdateDateColumn()
    updated_at: Date
} 