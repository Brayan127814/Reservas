import { Huespedes } from "src/huespedes/entities/huespede.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Rol {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:50})
    nombre: string

    @Column({type:'varchar', length: 100})
    descripcion:string
    @OneToMany(()=> Huespedes,(h)=> h.rol)
    user:Huespedes[]

}