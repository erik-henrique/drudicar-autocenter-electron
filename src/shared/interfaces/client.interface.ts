export default interface IClient {
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    contato: string;
    cep: string;
    uf: string;
    localidade: string;
    bairro: string;
    logradouro: string;
    numero: number;
    dataNascimento: Date;
    status: boolean;
}
