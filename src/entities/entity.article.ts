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
import { UserEntity } from "./entity.user";

@Entity({ name: "articles" })
export class ArticleEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext")
    title: string

    @Column("longtext")
    banner_url: string

    @ManyToOne(() => UserEntity, (user) => user.articles)
    @JoinColumn()
    author: UserEntity

    @Column("longtext")
    slug: string

    @Column("longtext")
    content: string

    @Column({ type: "json", nullable: false })
    services: PromotionType[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (this.title) {
            this.slug = SanitizerProvider.generateSlug(this.title)       // trim - from start/end
        }
    }

} 