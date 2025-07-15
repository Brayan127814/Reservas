import { Reserva } from "src/reservas/entities/reserva.entity";
import { Rol } from "src/rol/entities/rol.entities";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";


@Entity('huespedes')
export class Huespedes {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 50 })
    nombre: string
    @Column({ type: 'varchar', length: 80 })
    apellido: string

    @Column()
    correo: string

    @Column()
    contraseña: string
    @ManyToOne(() => Rol, (rol) => rol.user)
    rol: Rol
    @OneToMany(()=> Reserva, reserva=> reserva.huesped)
    reservas:Reserva[]
}
