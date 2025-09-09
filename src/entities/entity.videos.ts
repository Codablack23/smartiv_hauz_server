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
import { PromotionType, SanitizerProvider } from "src/lib";

@Entity({ name: "videos" })
export class VideoEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext")
    title: string

    @Column("longtext")
    banner_url: string

    @Column("longtext")
    video_url: string

    @Column("int")
    duration: number

    @Column("boolean", { default: false })
    is_featured: boolean

    @Column("longtext")
    slug: string

    @Column("longtext", { nullable: true })
    description?: string

    @Column({ type: "json", nullable: false })
    services: PromotionType[]

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