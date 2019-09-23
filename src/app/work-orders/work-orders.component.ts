import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import IWorkOrder from '../../shared/interfaces/work-order.interface';
import { DatabaseService } from '../../shared/services/data-access/database.service';
import { WorkOrderEntity } from '../../shared/services/data-access/entities/work-order.entity';
import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';
import { MatDialog } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Like } from 'typeorm';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status } from '../../shared/enums/status.enum';
import { WorkOrderTypes } from '../..//shared/enums/work-order-types.enum';

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

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService) {
  }

  async ngOnInit() {
    this.serviceFilterForm = this._fb.group({
      id: '',
      vehicleId: '',
      tipo: '',
      status: '',
      dataPagamento: '',
      produtos: '',
      servicos: '',
      observacoes: '',
    });

    this.serviceFilterForm.controls.vehicleId.valueChanges
    .pipe(debounceTime(2000), distinctUntilChanged()).subscribe(async (value: string) => {
      try {
        this.spinner.show();
        await this._databaseService
          .connection
          .then(async () => {
            if (typeof value === 'string') {
              // const workOrders = await WorkOrderEntity.find({ nome: Like(`%${value}%`) });
              // this.workOrders = workOrders as IWorkOrder[];
            }
          }).finally(() => {
            this.spinner.hide();
          });
      } catch (err) {
        console.error(err);
      }
    });

    await this.getWorkOrders();
  }

  async getWorkOrders() {
    try {
      this.spinner.show();
      await this._databaseService
        .connection
        .then(async () => {
          const workOrders = await WorkOrderEntity
          .find({relations: ['vehicle', 'vehicle.client'], where: { tipo: this.WORK_ORDER_TYPES.Orcamento }});
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
