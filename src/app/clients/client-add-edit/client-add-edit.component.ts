import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CpfCnpjValidator } from 'src/shared/validators/cpf-cnpj.validator';

@Component({
  selector: 'app-client-add-edit',
  templateUrl: './client-add-edit.component.html',
  styleUrls: ['./client-add-edit.component.scss']
})
export class ClientAddEditComponent implements OnInit {

  public clientForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.clientForm = this.fb.group({
      name: ['', [
        Validators.required
      ]],
      identifierKey: ['', [Validators.required, Validators.minLength(11),
      Validators.maxLength(11), CpfCnpjValidator.CpfValidator]
      ],
      email: ['', [Validators.email]],
      contact: ['', []],
      zipCode: ['', []],
      state: ['', []],
      city: ['', []],
      district: ['', []],
      street: ['', []],
      number: ['', []]
    });
  }

  get email() {
    return this.clientForm.get('email');
  }

  get name() {
    return this.clientForm.get('name');
  }

  get identifierKey() {
    return this.clientForm.get('identifierKey');
  }

}
