/* eslint-disable prettier/prettier */
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { } from "src/lib";
import { InvoiceEntity } from "./entity.invoices";

@Entity({ name: "invoice_notes" })
export class InvoiceNoteEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext")
    text: string


    @ManyToOne(() => InvoiceEntity, (invoice) => invoice.notes)
    @JoinColumn()
    invoice: InvoiceEntity

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
} 