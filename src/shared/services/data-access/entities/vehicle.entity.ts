import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'tb_vehicle' })
export class Vehicle extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    plaque: string;

    @Column()
    color: string;

    @Column()
    model: string;

    @Column()
    brand: string;

    @Column()
    year: string;

    @Column()
    modelYear: string;

    @Column()
    city: string;

    @Column()
    district: string;

    @Column()
    state: string;

    @Column()
    chassis: string;
}
