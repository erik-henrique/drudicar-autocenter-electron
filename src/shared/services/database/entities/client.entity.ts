import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'tb_client' })
export class ClientEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    cpf: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    celular: string;

    @Column({ nullable: true })
    cep: string;

    @Column({ nullable: true })
    uf: string;

    @Column({ nullable: true })
    localidade: string;

    @Column({ nullable: true })
    bairro: string;

    @Column({ nullable: true })
    logradouro: string;

    @Column({ nullable: true })
    numero: number;

    @Column({ nullable: true })
    dataNascimento: Date;

    @Column({ default: true })
    status: boolean;
}
