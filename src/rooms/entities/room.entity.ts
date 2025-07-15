import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('rooms')
export class Room {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    piso: number
    @Column()
    numero: number

    @Column({ type: 'varchar', default: 'disponible' })
    estado: string
    @Column()
    descripcion: string

}
