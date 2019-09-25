import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Like, In } from 'typeorm';
import { NgxSpinnerService } from 'ngx-spinner';

import { Status } from '../../shared/enums/status.enum';
import { WorkOrderTypes } from '../..//shared/enums/work-order-types.enum';
import { ClientEntity } from '../../shared/services/data-access/entities/client.entity';
import IWorkOrder from '../../shared/interfaces/work-order.interface';
import { DatabaseService } from '../../shared/services/data-access/database.service';
import { WorkOrderEntity } from '../../shared/services/data-access/entities/work-order.entity';
import { VehicleEntity } from '../../shared/services/data-access/entities/vehicle.entity';
import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.scss']
})
export class WorkOrdersComponent implements OnInit {
  public serviceFilterForm: FormGroup;
  public workOrders: IWorkOrder[];
  public STATUS = Status;
  public WORK_ORDER_TYPES = WorkOrderTypes;
  public type: string = this.WORK_ORDER_TYPES.Orcamento;

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) {
  }

  async ngOnInit() {
    this.serviceFilterForm = this._fb.group({
      veiculo: null,
      cliente: null
    });

    this.serviceFilterForm.controls.veiculo.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged()).subscribe(async (value: string) => {
        try {
          this.spinner.show();
          await this._databaseService
            .connection
            .then(async () => {
              if (typeof value === 'string') {
                this.serviceFilterForm.controls.cliente.reset();
                const vehicles = await VehicleEntity.find({ modelo: Like(`%${value}%`) });
                const vehicleIds = vehicles.map(v => v.id);

                const workOrders = await WorkOrderEntity
                  .find({
                    relations: ['vehicle', 'vehicle.client'],
                    where: {
                      vehicle: In(vehicleIds),
                      tipo: this.type
                    }
                  });

                console.log(workOrders);
                this.workOrders = workOrders as IWorkOrder[];
              }
            }).finally(() => {
              this.spinner.hide();
            });
        } catch (err) {
          console.error(err);
        }
      });

    this.serviceFilterForm.controls.cliente.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged()).subscribe(async (value: string) => {
        try {
          this.spinner.show();
          await this._databaseService
            .connection
            .then(async () => {
              if (typeof value === 'string') {
                this.serviceFilterForm.controls.veiculo.reset();
                const clients = await ClientEntity.find({ nome: Like(`%${value}%`) });
                const clientIds = clients.map(v => v.id);
                const workOrders = await WorkOrderEntity.createQueryBuilder('work')
                  .innerJoinAndSelect('work.vehicle', 'vehicle')
                  .innerJoinAndSelect('vehicle.client', 'client')
                  .where('vehicle.client.id IN (:...ids)', { ids: clientIds })
                  .andWhere('work.tipo = :tipo', { tipo: this.type })
                  .getMany();

                console.log(workOrders);
                this.workOrders = workOrders as IWorkOrder[];
              }
            }).finally(() => {
              this.spinner.hide();
            });
        } catch (err) {
          console.error(err);
        }
      });

    this.route.paramMap.subscribe(async params => {
      this.type = params['params'].type === 'orcamento'
        ? this.WORK_ORDER_TYPES.Orcamento : this.WORK_ORDER_TYPES.OrdemDeServico;
      await this.getWorkOrders();
    });
  }

  async getWorkOrders() {
    try {
      this.spinner.show();
      await this._databaseService
        .connection
        .then(async () => {
          const workOrders = await WorkOrderEntity
            .find({ relations: ['vehicle', 'vehicle.client'], where: { tipo: this.type } });
          console.log(workOrders);
          this.workOrders = workOrders as IWorkOrder[];
        }).finally(() => {
          this.spinner.hide();
        });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteService(service: IWorkOrder) {
    try {
      const confirmation = {
        message: 'Tem certeza que deseja Cancelar',
        data: service.id,
        action: 'Cancelar'
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
              await WorkOrderEntity.update({ id: service.id }, { status: this.STATUS.Cancelada });
              await this.getWorkOrders();
            });
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
}
