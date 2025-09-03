/* eslint-disable prettier/prettier */
import { 
    BeforeInsert, 
    Column, 
    CreateDateColumn, 
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn,
    BeforeUpdate
} from "typeorm";
import bcrypt from "bcrypt"
import { UserType } from "src/lib";

@Entity({name:"users"})
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("longtext")
    firstname: string

    @Column("longtext")
    lastname: string

    @Column("longtext")
    email: string

    @Column({type:"enum",enum:UserType,default:UserType.USER})
    user_type:UserType

    @Column("longtext",)
    password: string

    @Column("longtext",)
    phone_number: string

    @Column("longtext", {nullable:true})
    telegram_handle?: string


    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    @BeforeUpdate()
    async hashPasswordBeforeUpdate() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
} 