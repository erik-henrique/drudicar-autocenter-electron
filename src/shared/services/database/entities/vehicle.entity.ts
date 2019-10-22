import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinTable } from 'typeorm';
import { ClientEntity } from './client.entity';

@Entity({ name: 'tb_vehicle' })
export class VehicleEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    carLicense: string;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    model: string;

    @Column({ nullable: true })
    brand: string;

    @Column({ nullable: true })
    year: Date;

    @Column({ nullable: true })
    yearModel: Date;

    @Column({ nullable: true })
    district: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    chassis: string;

    @ManyToOne(type => ClientEntity, client => client.id) @JoinTable()
    client: ClientEntity;

    @Column({ default: true })
    status: boolean;
}
