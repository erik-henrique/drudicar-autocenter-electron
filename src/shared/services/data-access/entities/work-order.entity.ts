import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinTable } from 'typeorm';
import { WorkOrderTypes } from '../../../../shared/enums/work-order-types.enum';
import { Status } from '../../../../shared/enums/status.enum';
import { VehicleEntity } from './vehicle.entity';

@Entity({ name: 'tb_work_order' })
export class WorkOrderEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'vehicleId',
    })
    @ManyToOne(type => VehicleEntity)
    @JoinTable()
    vehicle: VehicleEntity;
    vehicleId: number;

    @Column()
    tipo: WorkOrderTypes;

    @Column()
    status: Status;

    @Column({})
    dataPagamento: Date;

    @Column({ nullable: true })
    produtos: string;

    @Column({ nullable: true })
    formaPagamento: string;

    @Column()
    servicos: string;

    @Column({ nullable: true })
    observacoes: string;
}
