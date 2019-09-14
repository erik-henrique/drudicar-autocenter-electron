import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import IWorkOrder from '../../../shared/interfaces/work-order.interface';
import { DatabaseService } from '../../../shared/services/data-access/database.service';
import { WorkOrderEntity } from '../../../shared/services/data-access/entities/work-order.entity';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClientEntity } from 'src/shared/services/data-access/entities/client.entity';
import IClient from 'src/shared/interfaces/client.interface';
import { VehicleEntity } from 'src/shared/services/data-access/entities/vehicle.entity';
import IVehicle from 'src/shared/interfaces/vehicle.interface';
import { ServiceEntity } from 'src/shared/services/data-access/entities/service.entity';
import IService from 'src/shared/interfaces/service.interface';

@Component({
  selector: 'app-work-order-add-edit',
  templateUrl: './work-order-add-edit.component.html',
  styleUrls: ['./work-order-add-edit.component.scss']
})
export class WorkOrderAddEditComponent implements OnInit {
  public payments = [
    {
      label: 'Dinheiro', value: 'Dinheiro'
    },
    {
      label: 'Á vista', value: 'Á vista'
    }
  ];

  public status = [
    {
      label: 'Aguardando Aprovação', value: 'Aguardando Aprovação'
    },
    {
      label: 'Em Andamento', value: 'Em Andamento'
    },
    {
      label: 'Finalizada', value: 'Finalizada'
    },
    {
      label: 'Cancelada', value: 'Cancelada'
    }
  ];

  public orcamentoForm: FormGroup;
  public id: number;
  public clients: IClient[];
  public vehicles: IVehicle[];
  public services: IService[];

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService) {

    this.id = parseInt(this.route.snapshot.paramMap.get('id'), null);
  }

  async ngOnInit() {
    this.orcamentoForm = this._fb.group({
      id: '',
      vehicle: [null, [
        Validators.required
      ]],
      client: [null, [
        Validators.required
      ]],
      status: '',
      observacoes: '',
      dataPagamento: '',
      formaPagamento: ''
    });

    setInterval(() => {
      console.log(this.orcamentoForm)
    }, 1000)

    this.orcamentoForm.controls.client.valueChanges
    .pipe(distinctUntilChanged()).subscribe(async (value: number) => {
      try {
        console.log('client', value);
        this.spinner.show();
        await this._databaseService
          .connection
          .then(async () => {
            if (typeof value === 'number') {
              const vechicles = await VehicleEntity.find({where: { clientId: value } });
              this.vehicles = vechicles as IVehicle[];
            }
          }).finally(() => {
            this.spinner.hide();
          });
      } catch (err) {
        console.error(err);
      }
    });

    await this.getClients();
    await this.getServices();

    if (this.id) {
      await this.getWorkOrder(this.id);
    }
  }

  get vehicleId() {
    return this.orcamentoForm.get('vehicle');
  }

  get statusFromForm() {
    return this.orcamentoForm.get('status');
  }

  async getClients() {
    try {
    this.spinner.show();

    await this._databaseService
      .connection
      .then(async () => {
        const clients = await ClientEntity.find();
        this.clients = clients as IClient[];
      }).finally(() => {
        this.spinner.hide();
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getServices() {
    try {
    this.spinner.show();

    await this._databaseService
      .connection
      .then(async () => {
        const clients = await ServiceEntity.find();
        this.services = clients as IService[];
      }).finally(() => {
        this.spinner.hide();
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getWorkOrder(id: number) {
    try {
      await this._databaseService
        .connection
        .then(async () => {
          const workOrder = await WorkOrderEntity.findOne(id, {relations: ['vehicle', 'vehicle.client']});
          this.orcamentoForm.patchValue(workOrder);
          console.log(workOrder)
          this.orcamentoForm.controls.client.patchValue(workOrder.vehicle.client.id);
          this.orcamentoForm.controls.vehicle.patchValue(workOrder.vehicle.id);
        });
    } catch (err) {
      console.error(err);
    }
  }

  // async deactivateWorkOrder() {
  //   try {
  //     const service = this.orcamentoForm.value as IWorkOrder;

  //     const confirmation = {
  //       message: 'Tem certeza que deseja desativar o serviço',
  //       data: service.,
  //       action: 'Desativar'
  //     };

  //     const dialogRef = this.dialog.open(ConfirmationComponent, {
  //       minWidth: '25%',
  //       minHeight: '25%',
  //       data: { ...confirmation }
  //     });

  //     dialogRef.afterClosed().subscribe(async (data) => {
  //       if (data) {
  //         await this._databaseService
  //           .connection
  //           .then(async () => {
  //             await WorkOrderEntity.update({ id: service.id }, { status: false });
  //             this.orcamentoForm.controls.status.setValue(false);
  //           });
  //       }
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // async activateService() {
  //   try {
  //     const service = this.orcamentoForm.value as IWorkOrder;

  //     const confirmation = {
  //       message: 'Tem certeza que deseja ativar o serviço',
  //       data: service.nome,
  //       action: 'Ativar'
  //     };

  //     const dialogRef = this.dialog.open(ConfirmationComponent, {
  //       minWidth: '25%',
  //       minHeight: '25%',
  //       data: { ...confirmation }
  //     });

  //     dialogRef.afterClosed().subscribe(async (data) => {
  //       if (data) {
  //         await this._databaseService
  //           .connection
  //           .then(async () => {
  //             await WorkOrderEntity.update({ id: service.id }, { status: true });
  //             this.orcamentoForm.controls.status.setValue(true);
  //           });
  //       }
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  async onSubmit() {
    try {
      if (this.orcamentoForm.valid) {
        const formValue = this.orcamentoForm.value as IWorkOrder;

        const workOrderEntity = Object.assign(new WorkOrderEntity(), formValue);

        if (!this.id) {
          delete workOrderEntity.id;
        }

        await this._databaseService
          .connection
          .then(async () => {
            const saveResult = await workOrderEntity.save();
            this.id = saveResult.id;
          });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
