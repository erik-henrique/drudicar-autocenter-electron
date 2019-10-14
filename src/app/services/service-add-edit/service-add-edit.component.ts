import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import IService from '../../../shared/interfaces/service.interface';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { ServiceEntity } from '../../../shared/services/database/entities/service.entity';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';


@Component({
  selector: 'app-service-add-edit',
  templateUrl: './service-add-edit.component.html',
  styleUrls: ['./service-add-edit.component.scss']
})
export class ServiceAddEditComponent implements OnInit {

  public serviceForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.serviceForm = this._fb.group({
      id: null,
      name: [null, [
        Validators.required
      ]],
      status: true
    });

    this.route.paramMap.subscribe(async params => {
      this.id.patchValue(parseInt(params['params'].id, null));
      if (this.id.value) {
        await this.getService(this.id.value);
      }
    });
  }

  get name() {
    return this.serviceForm.get('name');
  }

  get id() {
    return this.serviceForm.get('id');
  }

  get status() {
    return this.serviceForm.get('status');
  }

  async getService(id: number) {
    try {
      await this._databaseService
        .connection
        .then(async () => {
          const service = await ServiceEntity.findOne(id);
          this.serviceForm.patchValue(service);
        });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível carregar o serviço', 'OK', {
        duration: 2000,
      });
    }
  }

  async deactivateService() {
    try {
      const service = this.serviceForm.value as IService;

      const confirmation = {
        message: 'Tem certeza que deseja desativar o serviço',
        data: service.name,
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
              await ServiceEntity.update({ id: service.id }, { status: false });
              this.serviceForm.controls.status.setValue(false);
            });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível desativar o serviço', 'OK', {
        duration: 2000,
      });
    }
  }

  async activateService() {
    try {
      const service = this.serviceForm.value as IService;

      const confirmation = {
        message: 'Tem certeza que deseja ativar o serviço',
        data: service.name,
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
              await ServiceEntity.update({ id: service.id }, { status: true });
              this.serviceForm.controls.status.setValue(true);
            });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível ativar o serviço', 'OK', {
        duration: 2000,
      });
    }
  }

  async onSubmit() {
    try {
      if (this.serviceForm.valid) {
        const formValue = this.serviceForm.value as IService;

        const serviceEntity = Object.assign(new ServiceEntity(), formValue);

        if (!this.id.value) {
          delete serviceEntity.id;
        }

        await this._databaseService
          .connection
          .then(async () => {
            const saveResult = await serviceEntity.save();
            this.id.patchValue(saveResult.id);
          });
      }
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível salvar o serviço', 'OK', {
        duration: 2000,
      });
    }
  }
}
