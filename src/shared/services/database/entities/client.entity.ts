import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'tb_client' })
export class ClientEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  individualRegistration: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  cellphone: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  num: number;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ default: true })
  status: boolean;
}
