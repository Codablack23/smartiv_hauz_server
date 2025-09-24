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

export enum AddonType {
    flat = "flat",
    percentage = "percentage",
}

@Entity({ name: "invoice_addons" })
export class InvoiceAddOnEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("bigint")
    amount: number

    @Column("longtext")
    title: string

    @Column({ type: "enum", enum: AddonType, default: AddonType.percentage })
    type: AddonType

    @ManyToOne(() => InvoiceEntity, (invoice) => invoice.addons)
    @JoinColumn()
    invoice: InvoiceEntity

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
} 