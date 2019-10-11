import { WorkOrderTypes } from '../enums/work-order-types.enum';
import { Status } from '../enums/status.enum';

export default interface IWorkOrder {
    id: number;
    vehicleId: number;
    type: WorkOrderTypes;
    status: Status;
    paymentDate: Date;
    paymentMethod: string;
    products: string;
    services: string;
    comments: string;
}
