import IViaCEPLocation from '../interfaces/zipCode.interface';

export default class Localization {
  street: string;
  complement: string;
  district: string;
  city: string;
  state: string;

  constructor(viaCEPLocation: IViaCEPLocation) {
    this.street = viaCEPLocation.logradouro;
    this.complement = viaCEPLocation.complemento;
    this.district = viaCEPLocation.bairro;
    this.city = viaCEPLocation.localidade;
    this.state = viaCEPLocation.uf;
  }
}
