import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CpfCnpjValidator } from '../../../shared/validators/cpf-cnpj.validator';
import IZipCode from '../../../shared/interfaces/zipCode.interface';
import { HttpService } from '../../../shared/services/http.service';
import IClient from '../../../shared/interfaces/client.interface';
import { DatabaseService } from '../../../shared/services/data-access/database.service';
import { ClientEntity } from '../../../shared/services/data-access/entities/client.entity';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-client-add-edit',
  templateUrl: './client-add-edit.component.html',
  styleUrls: ['./client-add-edit.component.scss']
})
export class ClientAddEditComponent implements OnInit {

  public clientForm: FormGroup;
  public id: number;

  constructor(
    private _fb: FormBuilder,
    private _httpService: HttpService,
    private _databaseService: DatabaseService,
    private route: ActivatedRoute,
    private dialog: MatDialog) {

    this.id = parseInt(this.route.snapshot.paramMap.get('id'), null);
  }

  async ngOnInit() {
    this.clientForm = this._fb.group({
      id: '',
      nome: ['', [
        Validators.required
      ]],
      cpf: ['', [Validators.required, Validators.minLength(11),
      Validators.maxLength(11), CpfCnpjValidator.CpfValidator]
      ],
      status: true,
      email: ['', [Validators.email]],
      celular: '',
      cep: ['', [Validators.minLength(8),
      Validators.maxLength(8)]],
      uf: '',
      localidade: '',
      bairro: '',
      logradouro: '',
      numero: '',
      dataNascimento: ''
    });

    if (this.id) {
      await this.getClient(this.id);
    }

    this.clientForm.controls.cep.valueChanges.subscribe((value: string) => {
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

  get status() {
    return this.clientForm.get('status');
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

        if (!this.id) {
          delete clientEntity.id;
        }

        await this._databaseService
          .connection
          .then(async () => {
            const saveResult = await clientEntity.save();
            this.id = saveResult.id;
          });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
