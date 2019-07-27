import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'tb_client' })
export class Client extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    identifierKey: string;

    @Column()
    email: string;

    @Column()
    contact: string;

    @Column()
    zipCode: string;

    @Column()
    state: string;

    @Column()
    city: string;

    @Column()
    district: string;

    @Column()
    street: string;

    @Column()
    number: string;
}
