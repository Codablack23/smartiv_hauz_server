/* eslint-disable prettier/prettier */
import { PromotionType } from "src/lib";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"promotions"})
export class PromotionEntity{

    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column("enum",{enum:PromotionType,unique:true})
    promotion_type:PromotionType

    @Column("longtext")
    title:string

    @Column("longtext")
    caption:string
    
    @Column("longtext",{default:"<p></p>"})
    content:string

    @Column("longtext")
    banner_url:string 
    
    @Column("longtext")
    button_title:string
}