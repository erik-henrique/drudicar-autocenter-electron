import { WorkOrderTypes } from '../enums/work-order-types.enum';
import { Status } from '../enums/status.enum';
import IVehicle from './vehicle.interface';

export default interface IWorkOrder {
    id: number;
    vehicleId: number;
    vehicle: IVehicle;
    type: WorkOrderTypes;
    status: Status;
    paymentDate: Date;
    paymentMethod: string;
    products: any;
    services: any;
    comments: string;
}
