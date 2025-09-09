/* eslint-disable prettier/prettier */
import { PromotionType } from "src/lib";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "quotes" })
export class QuoteEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext", { unique: true })
    name: string

    @Column("longtext")
    email: string

    @Column("longtext")
    phone_number: string

    @Column({ type: "json", nullable: false })
    services: PromotionType[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
} 