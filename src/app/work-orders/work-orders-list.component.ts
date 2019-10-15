import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Like, In } from 'typeorm';
import { NgxSpinnerService } from 'ngx-spinner';

import { Status } from '../../shared/enums/status.enum';
import { WorkOrderTypes } from '../../shared/enums/work-order-types.enum';
import { ClientEntity } from '../../shared/services/database/entities/client.entity';
import IWorkOrder from '../../shared/interfaces/work-order.interface';
import { DatabaseService } from '../../shared/services/database/database.service';
import { WorkOrderEntity } from '../../shared/services/database/entities/work-order.entity';
import { VehicleEntity } from '../../shared/services/database/entities/vehicle.entity';
import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';
import { WorkOrderPreviewComponent } from './work-order-preview/work-order-preview.component';

@Component({
  selector: 'app-work-orders-list',
  templateUrl: './work-orders-list.component.html',
  styleUrls: ['./work-orders-list.component.scss']
})
export class WorkOrdersComponent implements OnInit {
  public serviceFilterForm: FormGroup;
  public workOrders: IWorkOrder[];
  public STATUS = Status;
  public WORK_ORDER_TYPES = WorkOrderTypes;
  public type: string = this.WORK_ORDER_TYPES.Budget;

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar) {
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
                const vehicles = await VehicleEntity.find({ model: Like(`%${value}%`) });
                const vehicleIds = vehicles.map(v => v.id);

                const workOrders = await WorkOrderEntity
                  .find({
                    relations: ['vehicle', 'vehicle.client'],
                    where: {
                      vehicle: In(vehicleIds),
                      type: this.type
                    }
                  });

                this.workOrders = workOrders as IWorkOrder[];
              }
            }).finally(() => {
              this.spinner.hide();
            });
        } catch (err) {
          console.error(err);
          this._snackBar.open('Não foi possível carregar os veículos filtrados', 'OK', {
            duration: 2000,
          });
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
                const clients = await ClientEntity.find({ name: Like(`%${value}%`) });
                const clientIds = clients.map(v => v.id);
                const workOrders = await WorkOrderEntity.createQueryBuilder('work')
                  .innerJoinAndSelect('work.vehicle', 'vehicle')
                  .innerJoinAndSelect('vehicle.client', 'client')
                  .where('vehicle.client.id IN (:...ids)', { ids: clientIds })
                  .andWhere('work.type = :type', { type: this.type })
                  .getMany();

                console.log(workOrders);
                this.workOrders = workOrders as IWorkOrder[];
              }
            }).finally(() => {
              this.spinner.hide();
            });
        } catch (err) {
          console.error(err);
          this._snackBar.open('Não foi possível carregar os clientes filtrados', 'OK', {
            duration: 2000,
          });
        }
      });

    this.route.paramMap.subscribe(async params => {
      this.type = params['params'].type === 'orcamento'
        ? this.WORK_ORDER_TYPES.Budget : this.WORK_ORDER_TYPES.WorkWorder;
      await this.getWorkOrders();
    });
  }

  public showPreview(id: number) {
    console.log('id', id)
    this.dialog.open(WorkOrderPreviewComponent, {
      minWidth: '50%',
      minHeight: '50%',
      width: '90%',
      height: '90%',
      data: id.toString()
    });
  }

  public goToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async getWorkOrders() {
    try {
      this.spinner.show();
      await this._databaseService
        .connection
        .then(async () => {
          const workOrders = await WorkOrderEntity
            .find({ relations: ['vehicle', 'vehicle.client'], where: { type: this.type } });
          console.log(workOrders);
          this.workOrders = workOrders as IWorkOrder[];
        }).finally(() => {
          this.spinner.hide();
        });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível carregar os dados', 'OK', {
        duration: 2000,
      });
    }
  }

  async deleteService(service: IWorkOrder) {
    try {
      const confirmation = {
        message: `Tem certeza que deseja cancelar ${
          this.type === this.WORK_ORDER_TYPES.Budget ? 'o orçamento' : 'a ordem de serviço'} nº`,
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
              await WorkOrderEntity.update({ id: service.id }, { status: this.STATUS.Canceled });
              await this.getWorkOrders();
            });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível cancelar', 'OK', {
        duration: 2000,
      });
    }
  }
}
