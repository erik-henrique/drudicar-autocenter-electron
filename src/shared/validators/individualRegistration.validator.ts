import { AbstractControl } from '@angular/forms';

export class IndividualRegistrationValidator {
  static validate(controle: AbstractControl) {
    const identifierKey = controle.value;

    if (identifierKey == null) {
      return { individualRegistrationInvalid: true };
    }
    if (identifierKey.length !== 11) {
      return { individualRegistrationInvalid: true };
    }

    if (
      identifierKey === '00000000000' ||
      identifierKey === '11111111111' ||
      identifierKey === '22222222222' ||
      identifierKey === '33333333333' ||
      identifierKey === '44444444444' ||
      identifierKey === '55555555555' ||
      identifierKey === '66666666666' ||
      identifierKey === '77777777777' ||
      identifierKey === '88888888888' ||
      identifierKey === '99999999999'
    ) {
      return { individualRegistrationInvalid: true };
    }

    let num = 0;
    let chars = '';
    const nums = '0123456789';
    let j = 10;
    let sum = 0;
    let rest = 0;
    let firstNum = 0;
    let secondNum = 0;
    let individualRegistrationAux = '';

    individualRegistrationAux = identifierKey.substring(0, 9);

    for (let i = 0; i < 9; i++) {
      chars = individualRegistrationAux.charAt(i);

      if (nums.search(chars) === -1) {
        return { individualRegistrationInvalid: true };
      }

      num = Number(chars);
      sum = sum + num * j;
      j--;
    }

    rest = sum % 11;
    firstNum = 11 - rest;

    if (firstNum > 9) {
      firstNum = 0;
    }

    j = 11;
    sum = 0;
    individualRegistrationAux = individualRegistrationAux + firstNum;

    for (let i = 0; i < 10; i++) {
      chars = individualRegistrationAux.charAt(i);
      num = Number(chars);
      sum = sum + num * j;
      j--;
    }

    rest = sum % 11;
    secondNum = 11 - rest;

    if (secondNum > 9) {
      secondNum = 0;
    }

    individualRegistrationAux = individualRegistrationAux + secondNum;

    if (identifierKey !== individualRegistrationAux) {
      return { individualRegistrationInvalid: true };
    } else {
      return null;
    }
  }
}
