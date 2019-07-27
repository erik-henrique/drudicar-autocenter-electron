import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'tb_vehicle' })
export class Vehicle extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    placa: string;

    @Column()
    cor: string;

    @Column()
    modelo: string;

    @Column()
    marca: string;

    @Column()
    ano: string;

    @Column()
    anoiModelo: string;

    @Column()
    localidade: string;

    @Column()
    bairro: string;

    @Column()
    uf: string;

    @Column()
    chassis: string;
}
