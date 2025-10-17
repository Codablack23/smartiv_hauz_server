/* eslint-disable prettier/prettier */
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { SanitizerProvider } from "src/lib";


@Entity({ name: "resources" })
export class ResourceEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext")
    title: string
    
    @Column("longtext")
    banner_url: string
    
    @Column("longtext")
    file_url: string

    @Column("longtext")
    slug: string

    @Column("longtext", { nullable: true })
    description?: string


    @CreateDateColumn()
    created_at: Date

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (this.title) {
            this.slug = SanitizerProvider.generateSlug(this.title)       // trim - from start/end
        }
    }

    @UpdateDateColumn()
    updated_at: Date
} 