import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CpfCnpjValidator } from '../../../shared/validators/cpf-cnpj.validator';
import IZipCode from '../../../shared/interfaces/zipCode.interface';
import { HttpService } from '../../../shared/services/http/http.service';
import IClient from '../../../shared/interfaces/client.interface';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { ClientEntity } from '../../../shared/services/database/entities/client.entity';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';

@Component({
  selector: 'app-client-add-edit',
  templateUrl: './client-add-edit.component.html',
  styleUrls: ['./client-add-edit.component.scss']
})
export class ClientAddEditComponent implements OnInit {
  public clientForm: FormGroup;
  private ZIP_SERVICE_URL = 'https://viacep.com.br/ws';
  private ZIP_RETURN_TYPE = 'json';

  constructor(
    private _fb: FormBuilder,
    private _httpService: HttpService,
    private _databaseService: DatabaseService,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.clientForm = this._fb.group({
      id: null,
      nome: [null, [
        Validators.required
      ]],
      cpf: [null, [Validators.required, Validators.minLength(11),
      Validators.maxLength(11), CpfCnpjValidator.CpfValidator]
      ],
      status: true,
      email: [null, [Validators.email]],
      celular: null,
      cep: [null, [Validators.minLength(8),
      Validators.maxLength(8)]],
      uf: null,
      localidade: null,
      bairro: null,
      logradouro: null,
      numero: null,
      dataNascimento: null
    });

    this.route.paramMap.subscribe(async params => {
      this.id.patchValue(parseInt(params['params'].id, null));

      if (this.id.value) {
        await this.getClient(this.id.value);
      }
    });

    this.clientForm.controls.cep.valueChanges.subscribe((value: string) => {
      if (value.length === 8) {
        this.findClientZipCode(value);
      }
    });
  }

  get email() {
    return this.clientForm.get('email');
  }

  get id() {
    return this.clientForm.get('id');
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

  get status() {
    return this.clientForm.get('status');
  }

  public async findClientZipCode(zipcode: string) {
    try {
      const cep = await this._httpService.get(this.ZIP_SERVICE_URL, this.ZIP_RETURN_TYPE, zipcode).toPromise() as IZipCode;
      delete cep['cep'];
      this.clientForm.patchValue(cep);
    } catch (err) {
      console.error(err);
    }
  }

  async getClient(id: number) {
    try {
      await this._databaseService
        .connection
        .then(async () => {
          const client = await ClientEntity.findOne(id);
          this.clientForm.patchValue(client);
        });
    } catch (err) {
      console.error(err);
    }
  }

  async deactivateClient() {
    try {
      const client = this.clientForm.value as IClient;

      const confirmation = {
        message: 'Tem certeza que deseja desativar o cliente',
        data: client.nome,
        action: 'Desativar'
      };

      const dialogRef = this.dialog.open(ConfirmationComponent, {
        minWidth: '25%',
        minHeight: '25%',
        data: { ...confirmation }
      });

      dialogRef.afterClosed().subscribe(async (data) => {
        if (data) {
          await this._databaseService
            .connection
            .then(async () => {
              await ClientEntity.update({ id: client.id }, { status: false });
              this.clientForm.controls.status.setValue(false);
            });
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async activateClient() {
    try {
      const client = this.clientForm.value as IClient;

      const confirmation = {
        message: 'Tem certeza que deseja ativar o cliente',
        data: client.nome,
        action: 'Ativar'
      };

      const dialogRef = this.dialog.open(ConfirmationComponent, {
        minWidth: '25%',
        minHeight: '25%',
        data: { ...confirmation }
      });

      dialogRef.afterClosed().subscribe(async (data) => {
        if (data) {
          await this._databaseService
            .connection
            .then(async () => {
              await ClientEntity.update({ id: client.id }, { status: true });
              this.clientForm.controls.status.setValue(true);
            }).catch(err => console.error(err));
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async onSubmit() {
    try {
      if (this.clientForm.valid) {
        const formValue = this.clientForm.value as IClient;

        const clientEntity = Object.assign(new ClientEntity(), formValue);

        if (!this.id.value) {
          delete clientEntity.id;
        }

        await this._databaseService
          .connection
          .then(async () => {
            const saveResult = await clientEntity.save();
            this.id.patchValue(saveResult.id);
          });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
