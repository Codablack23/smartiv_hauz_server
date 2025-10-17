/* eslint-disable prettier/prettier */
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";


@Entity({ name: "team_members" })
export class TeamMemberEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext",{unique:true})
    name: string
    
    @Column("longtext",{unique:true})
    position: string
    
    @Column("longtext",{unique:true,nullable:true})
    email?: string

    @Column("longtext")
    avatar: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
} 