import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

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

    @Column({ nullable: true })
    clientId: number;

    @Column({ default: true })
    status: boolean;
}
