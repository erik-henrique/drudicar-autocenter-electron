import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinTable } from 'typeorm';
import { ClientEntity } from './client.entity';

@Entity({ name: 'tb_vehicle' })
export class VehicleEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    placa: string;

    @Column({ nullable: true })
    cor: string;

    @Column({ nullable: true })
    modelo: string;

    @Column({ nullable: true })
    marca: string;

    @Column({ nullable: true })
    ano: Date;

    @Column({ nullable: true })
    anoModelo: Date;

    @Column({ nullable: true })
    municipio: string;

    @Column({ nullable: true })
    uf: string;

    @Column({ nullable: true })
    chassi: string;

    @Column({
        name: 'clientId',
    })
    @ManyToOne(type => ClientEntity)
    @JoinTable()
    client: ClientEntity;
    clientId: number;

    @Column({ default: true })
    status: boolean;
}
