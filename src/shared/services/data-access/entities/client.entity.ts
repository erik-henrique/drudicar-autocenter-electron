import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'tb_client' })
export class Client extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    cpf: string;

    @Column()
    email: string;

    @Column()
    contato: string;

    @Column()
    cep: string;

    @Column()
    uf: string;

    @Column()
    localidade: string;

    @Column()
    bairro: string;

    @Column()
    logradouro: string;

    @Column()
    numero: string;
}
