import { ESTADORESERVA } from "src/enums/estado-reserva.enum";
import { Huespedes } from "src/huespedes/entities/huespede.entity";
import { Room } from "src/rooms/entities/room.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinTable, ManyToMany } from "typeorm";



@Entity('reservas')
export class Reserva {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'date' })
    fechaInicio: Date

    @Column({ type: 'date' })
    fechaFin: Date
    @Column({ default: ESTADORESERVA.PENDIENTE })
    estado: string

    @ManyToOne(() => Huespedes, (huesped) => huesped.reservas)
    huesped: Huespedes

    @ManyToMany(() => Room)
    @JoinTable()
    rooms: Room[]

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    total: number

    @CreateDateColumn()
    createAt: Date
}
