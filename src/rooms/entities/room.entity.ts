import { ESTADOHABITACION } from "src/enums/estado-habitacion.enum";
import { Reserva } from "src/reservas/entities/reserva.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";

@Entity('rooms')
export class Room {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    piso: number
    @Column()
    numero: number
    

    @Column({type:'float'})
    precio: number

    @Column({ type: 'varchar', default: ESTADOHABITACION.DISPONIBLE })
    estado: string
    @Column()
    descripcion: string

    @ManyToMany(()=> Reserva)
    @JoinTable()
    reservas:Reserva[]

    
}
