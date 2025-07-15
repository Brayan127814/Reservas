import { Huespedes } from "src/huespedes/entities/huespede.entity";
import { Entity ,PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";



@Entity('reservas')
export class Reserva {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'date'})
    fechaInicio: Date

    @Column({type:'date'})
    fechaFin:Date
    @Column({default:'pendiente'})
    estado:string

    @ManyToOne(()=>Huespedes,(huesped)=> huesped.reservas)
    huesped:Huespedes

    @Column('decimal',{precision:10,scale:2, nullable:true})
    total:number

    @CreateDateColumn()
    createAt:Date
}
