export default interface IClient {
    id?: number;
    name: string;
    individualRegistration: string;
    email: string;
    cellphone: string;
    zip: string;
    state: string;
    city: string;
    district: string;
    street: string;
    num: number;
    birthDate: Date;
    status: boolean;
}
