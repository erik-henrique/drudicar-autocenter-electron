import IClient from './client.interface';

export default interface IVehicle {
    id?: number;
    clientId?: number;
    client?: IClient;
    carLicense: string;
    year: Date;
    yearModel: Date;
    chassis: string;
    color: string;
    brand: string;
    model: string;
    district: string;
    state: string;
    status: boolean;
}
