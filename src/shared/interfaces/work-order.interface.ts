import { WorkOrderTypes } from '../enums/work-order-types.enum';
import { Status } from '../enums/status.enum';

export default interface IWorkOrder {
    id: number;

    vehicleId: number;

    tipo: WorkOrderTypes;

    status: Status;

    dataPagamento: Date;
    formaPagamento: string;

    produtos: string;
    servicos: string;
    observacoes: string;
}
