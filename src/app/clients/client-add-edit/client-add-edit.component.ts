import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CpfCnpjValidator } from 'src/shared/validators/cpf-cnpj.validator';
import IZipCode from 'src/shared/interfaces/zipCode.interface';
import { HttpService } from 'src/shared/services/http.service';


@Component({
  selector: 'app-client-add-edit',
  templateUrl: './client-add-edit.component.html',
  styleUrls: ['./client-add-edit.component.scss']
})
export class ClientAddEditComponent implements OnInit {

  public clientForm: FormGroup;

  constructor(private _fb: FormBuilder, private _httpService: HttpService) { }

  ngOnInit() {
    this.clientForm = this._fb.group({
      nome: ['', [
        Validators.required
      ]],
      cpf: ['', [Validators.required, Validators.minLength(11),
      Validators.maxLength(11), CpfCnpjValidator.CpfValidator]
      ],
      email: ['', [Validators.email]],
      contato: [''],
      cep: ['', [ Validators.minLength(8),
        Validators.maxLength(8)]],
      uf: [''],
      localidade: [''],
      bairro: [''],
      logradouro: [''],
      numero: ['']
    });

    this.clientForm.controls.cep.valueChanges.subscribe((value: string) => {
      console.log(value.length);
      if (value.length === 8) {
        this.findClientZipCode(value);
      }
    });
  }

  get email() {
    return this.clientForm.get('email');
  }

  get nome() {
    return this.clientForm.get('nome');
  }

  get cpf() {
    return this.clientForm.get('cpf');
  }

  get cep() {
    return this.clientForm.get('cep');
  }

  public async findClientZipCode(clientZipCode: string) {
    try {
      const cep: IZipCode = await this._httpService.getZipCode(clientZipCode).toPromise();
      delete cep['cep'];
      this.clientForm.patchValue(cep);
    } catch (err) {
      console.error(err);
    }
  }
}
