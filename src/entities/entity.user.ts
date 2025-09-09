/* eslint-disable prettier/prettier */
import { 
    BeforeInsert, 
    Column, 
    CreateDateColumn, 
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn,
    BeforeUpdate,
    OneToMany,
} from "typeorm";
import bcrypt from "bcrypt"
import { UserType } from "src/lib";
import { ArticleEntity } from "./entity.article";

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

    @Column({type:"enum",enum:UserType,default:UserType.SUPER_ADMIN})
    user_type:UserType

    @Column("longtext",)
    password: string

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

    @OneToMany(()=>ArticleEntity,(article)=>article.author)
    articles:ArticleEntity[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
} 