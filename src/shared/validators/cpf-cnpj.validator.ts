import { AbstractControl } from '@angular/forms';

export class CpfCnpjValidator {
  static CpfValidator(controle: AbstractControl) {
    const identifierKey = controle.value;

    if (identifierKey == null) {
      return { cpfInvalid: true};
    }
    if (identifierKey.length !== 11) {
      return { cpfInvalid: true};
    }

    if ((identifierKey === '00000000000')
      || (identifierKey === '11111111111')
      || (identifierKey === '22222222222')
      || (identifierKey === '33333333333')
      || (identifierKey === '44444444444')
      || (identifierKey === '55555555555')
      || (identifierKey === '66666666666')
      || (identifierKey === '77777777777')
      || (identifierKey === '88888888888')
      || (identifierKey === '99999999999')) {
      return { cpfInvalid: true};
    }
    let numero = 0;
    let caracter = '';
    const numeros = '0123456789';
    let j = 10;
    let somatorio = 0;
    let resto = 0;
    let digito1 = 0;
    let digito2 = 0;
    let cpfAux = '';
    cpfAux = identifierKey.substring(0, 9);
    for (let i = 0; i < 9; i++) {
      caracter = cpfAux.charAt(i);
      if (numeros.search(caracter) === -1) {
        return { cpfInvalid: true};
      }
      numero = Number(caracter);
      somatorio = somatorio + (numero * j);
      j--;
    }
    resto = somatorio % 11;
    digito1 = 11 - resto;
    if (digito1 > 9) {
      digito1 = 0;
    }
    j = 11;
    somatorio = 0;
    cpfAux = cpfAux + digito1;
    for (let i = 0; i < 10; i++) {
      caracter = cpfAux.charAt(i);
      numero = Number(caracter);
      somatorio = somatorio + (numero * j);
      j--;
    }
    resto = somatorio % 11;
    digito2 = 11 - resto;
    if (digito2 > 9) {
      digito2 = 0;
    }
    cpfAux = cpfAux + digito2;
    if (identifierKey !== cpfAux) {
      return { cpfInvalid: true};
    } else {
      return null;
    }
  }
  // let sum = 0;
  // let rest: number;
  // let valid: boolean;

  // const regex = new RegExp('[0-9]{11}');

  // if (
  //   identifierKey === '00000000000' ||
  //   identifierKey === '11111111111' ||
  //   identifierKey === '22222222222' ||
  //   identifierKey === '33333333333' ||
  //   identifierKey === '44444444444' ||
  //   identifierKey === '55555555555' ||
  //   identifierKey === '66666666666' ||
  //   identifierKey === '77777777777' ||
  //   identifierKey === '88888888888' ||
  //   identifierKey === '99999999999' ||
  //   !regex.test(identifierKey)
  // ) {
  //   valid = false;
  // } else {
  //   for (let i = 1; i <= 9; i++) {
  //     sum = sum + parseInt(identifierKey.substring(i - 1, i), null) * (11 - i);
  //   }
  //   rest = (sum * 10) % 11;

  //   if (rest === 10 || rest === 11) { rest = 0; }
  //   if (rest !== parseInt(identifierKey.substring(9, 10), null)) { valid = false; }

  //   sum = 0;
  //   for (let i = 1; i <= 10; i++) {
  //     sum = sum + parseInt(identifierKey.substring(i - 1, i), null) * (12 - i);
  //   }
  //   rest = (sum * 10) % 11;

  //   if (rest === 10 || rest === 11) { rest = 0; }
  //   if (rest !== parseInt(identifierKey.substring(10, 11), null)) { valid = false; }
  //   valid = true;
  // }

  // if (valid) { return { cpfInvalid: true}; }

  // return { cpfInvalido: true };
}
