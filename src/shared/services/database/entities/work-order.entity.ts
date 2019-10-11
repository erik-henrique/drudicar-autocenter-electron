import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinTable } from 'typeorm';
import { WorkOrderTypes } from '../../../enums/work-order-types.enum';
import { Status } from '../../../enums/status.enum';
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
    type: WorkOrderTypes;

    @Column()
    status: Status;

    @Column({ nullable: true })
    paymentDate: Date;

    @Column({ nullable: true })
    products: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column()
    services: string;

    @Column({ nullable: true })
    comments: string;
}
