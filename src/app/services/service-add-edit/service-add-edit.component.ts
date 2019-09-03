import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import IZipCode from '../../../shared/interfaces/zipCode.interface';
import { HttpService } from '../../../shared/services/http.service';
import IService from '../../../shared/interfaces/service.interface';
import { DatabaseService } from '../../../shared/services/data-access/database.service';
import { ServiceEntity } from '../../../shared/services/data-access/entities/service.entity';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-service-add-edit',
  templateUrl: './service-add-edit.component.html',
  styleUrls: ['./service-add-edit.component.scss']
})
export class ServiceAddEditComponent implements OnInit {

  public serviceForm: FormGroup;
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
    this.serviceForm = this._fb.group({
      id: '',
      nome: ['', [
        Validators.required
      ]],
      status: true
    });

    if (this.id) {
      await this.getService(this.id);
    }
  }

  get nome() {
    return this.serviceForm.get('nome');
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
    }
  }

  async deactivateService() {
    try {
      const service = this.serviceForm.value as IService;

      const confirmation = {
        message: 'Tem certeza que deseja desativar o serviço',
        data: service.nome,
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
    }
  }

  async activateService() {
    try {
      const service = this.serviceForm.value as IService;

      const confirmation = {
        message: 'Tem certeza que deseja ativar o serviço',
        data: service.nome,
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
    }
  }

  async onSubmit() {
    try {
      if (this.serviceForm.valid) {
        const formValue = this.serviceForm.value as IService;

        const serviceEntity = Object.assign(new ServiceEntity(), formValue);

        if (!this.id) {
          delete serviceEntity.id;
        }

        await this._databaseService
          .connection
          .then(async () => {
            const saveResult = await serviceEntity.save();
            this.id = saveResult.id;
          });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
