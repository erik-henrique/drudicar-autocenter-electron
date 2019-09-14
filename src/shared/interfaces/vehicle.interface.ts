import IClient from './client.interface';

export default interface IVehicle {
    id?: number;
    clientId?: number;
    client?: IClient;
    placa: string;
    ano: Date;
    anoModelo: Date;
    chassi: string;
    cor: string;
    marca: string;
    modelo: string;
    municipio: string;
    uf: string;
    status: boolean;
}
