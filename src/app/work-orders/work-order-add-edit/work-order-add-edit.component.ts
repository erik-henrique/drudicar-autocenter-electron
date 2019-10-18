import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { distinctUntilChanged } from 'rxjs/operators';

import IWorkOrder from '../../../shared/interfaces/work-order.interface';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { WorkOrderEntity } from '../../../shared/services/database/entities/work-order.entity';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { ClientEntity } from '../../../shared/services/database/entities/client.entity';
import IClient from '../../../shared/interfaces/client.interface';
import { VehicleEntity } from '../../../shared/services/database/entities/vehicle.entity';
import IVehicle from '../../../shared/interfaces/vehicle.interface';
import { ServiceEntity } from '../../../shared/services/database/entities/service.entity';
import IService from '../../../shared/interfaces/service.interface';
import { Status } from '../../../shared/enums/status.enum';
import { WorkOrderTypes } from '../../../shared/enums/work-order-types.enum';

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
      label: 'Cartão de Débito', value: 'Cartão de Débito'
    },
    {
      label: 'Cartão de Crédito', value: 'Cartão de Crédito'
    }
  ];

  public status = [
    {
      label: 'Em Andamento', value: 'Em Andamento'
    },
    {
      label: 'Finished', value: 'Finalizado'
    },
    {
      label: 'Disponível', value: 'Disponível'
    },
  ];

  public orcamentoForm: FormGroup;
  public clients: IClient[];
  public vehicles: IVehicle[];
  public services: IService[];

  public STATUS = Status;
  public WORK_ORDER_TYPES = WorkOrderTypes;

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.orcamentoForm = this._fb.group({
      id: null,
      vehicle: [null, [
        Validators.required
      ]],
      client: [null, [
        Validators.required
      ]],
      services: this._fb.array([], Validators.required),
      products: this._fb.array([]),
      status: 'Aguardando Aprovação',
      type: ['Orçamento', Validators.required],
      comments: null,
      paymentDate: null,
      paymentMethod: null,
      valor: null
    });

    this.orcamentoForm.controls.client.valueChanges
      .pipe(distinctUntilChanged()).subscribe(async (value: number) => {
        try {
          this.spinner.show();
          await this._databaseService
            .connection
            .then(async () => {
              if (typeof value === 'number') {
                const vechicles = await VehicleEntity.find({ where: { client: value, status: true } });
                this.vehicles = vechicles as IVehicle[];
              }
            }).finally(() => {
              this.spinner.hide();
            });
        } catch (err) {
          console.error(err);
          this._snackBar.open('Não foi possível carregar os veículos.', 'OK', {
            duration: 2000,
          });
        }
      });

    await this.getClients();
    await this.getServices();

    this.route.paramMap.subscribe(async params => {
      this.id.patchValue(parseInt(params['params'].id, null));

      if (this.id.value) {
        await this.getWorkOrder(this.id.value);
      }
    });
  }

  get serviceForms() {
    return this.orcamentoForm.get('services') as FormArray;
  }

  addService() {
    const service = this._fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required]
    });

    this.serviceForms.push(service);
  }

  deleteService(i) {
    this.serviceForms.removeAt(i);
  }

  get productForms() {
    return this.orcamentoForm.get('products') as FormArray;
  }

  addProduct() {
    const product = this._fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
      amount: [null, Validators.required]
    });

    this.productForms.push(product);
  }

  deleteProduct(i) {
    this.productForms.removeAt(i);
  }

  get vehicle() {
    return this.orcamentoForm.get('vehicle');
  }

  get id() {
    return this.orcamentoForm.get('id');
  }

  get statusFromForm() {
    return this.orcamentoForm.get('status');
  }

  get typeFromForm() {
    return this.orcamentoForm.get('type');
  }

  filterServices(value: string): Boolean {
    return this.services.find(s => s.name === value) ? false : true;
  }

  get totalValue() {
    const products = this.orcamentoForm.get('products') as FormArray;
    const services = this.orcamentoForm.get('services') as FormArray;

    if (!products.value.length && !services.value.length) {
      return 0;
    }

    if (products.value.length && !services.value.length) {
      return parseFloat(products.value.map(product => product.price * product.amount)
        .reduce((accum, curr) => accum + curr));
    }

    if (!products.value.length && services.value.length) {
      return parseFloat(services.value
        .map(value => value.price ? value.price : 0)
        .reduce((accum, curr) => accum + curr));
    }

    return parseFloat(products.value
      .map(product => product.price * product.amount)
      .reduce((accum, curr) => accum + curr) + services.value
        .map(value => value.price)
        .reduce((accum, curr) => accum + curr));
  }

  async getClients() {
    try {
      this.spinner.show();

      await this._databaseService
        .connection
        .then(async () => {
          const clients = await ClientEntity.find();
          this.clients = clients;
        }).finally(() => {
          this.spinner.hide();
        });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível carregar os clientes.', 'OK', {
        duration: 2000,
      });
    }
  }

  async getServices() {
    try {
      this.spinner.show();

      await this._databaseService
        .connection
        .then(async () => {
          const clients = await ServiceEntity.find({ status: true });
          this.services = clients as IService[];
        }).finally(() => {
          this.spinner.hide();
        });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível carregar os serviços.', 'OK', {
        duration: 2000,
      });
    }
  }

  async getWorkOrder(id: number) {
    try {
      await this._databaseService
        .connection
        .then(async () => {
          const workOrder = await WorkOrderEntity.findOne(id, { relations: ['vehicle', 'vehicle.client'] });
          const services = JSON.parse(workOrder.services) as any[];
          const products = JSON.parse(workOrder.products) as any[];

          delete workOrder.services;
          delete workOrder.products;

          services.forEach(s => this.serviceForms.push(this._fb.group({
            name: [s.name, Validators.required],
            price: [s.price, Validators.required]
          })));

          products.forEach(p => this.productForms.push(this._fb.group({
            name: [p.name, Validators.required],
            price: [p.price, Validators.required],
            amount: [p.amount, Validators.required]
          })));

          console.log(workOrder);
          this.orcamentoForm.patchValue(workOrder);

          if (!workOrder.vehicle.client.status) {
            this.clients.push(workOrder.vehicle.client);
          }

          if (!workOrder.vehicle.status) {
            this.vehicles.push(workOrder.vehicle);
          }

          this.orcamentoForm.controls.client.patchValue(workOrder.vehicle.client.id);

          this.orcamentoForm.controls.client.disable();
          this.orcamentoForm.controls.vehicle.patchValue(workOrder.vehicle.id);

          if (this.orcamentoForm.controls.status.value === this.STATUS.Canceled
            || this.orcamentoForm.controls.status.value === this.STATUS.Finished) {
            this.orcamentoForm.disable();
          }
        });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível carregar.', 'OK', {
        duration: 2000,
      });
    }
  }

  async cancelWorkOrder() {
    try {
      const orcamento = this.orcamentoForm.value as IWorkOrder;

      const confirmation = {
        message: 'Deseja cancelar o',
        data: `${orcamento.type} Nº ${orcamento.id}`,
        action: 'Sim'
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
              await WorkOrderEntity.update({ id: orcamento.id }, { status: this.STATUS.Canceled });
              this.orcamentoForm.controls.status.setValue(this.STATUS.Canceled);
              this.orcamentoForm.disable();
            });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível cancelar.', 'OK', {
        duration: 2000,
      });
    }
  }

  async transformIntoWorkOrder() {
    try {
      const orcamento = this.orcamentoForm.value as IWorkOrder;

      const confirmation = {
        message: 'Transformar em Ordem de Serviço o ',
        data: `Orçamento Nº ${orcamento.id}`,
        action: 'Sim'
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
              await WorkOrderEntity
                .update({ id: orcamento.id }, { status: this.STATUS.Available, type: this.WORK_ORDER_TYPES.WorkWorder });
              this.orcamentoForm.controls.status.setValue(this.STATUS.Available);
              this.orcamentoForm.controls.type.setValue(this.WORK_ORDER_TYPES.WorkWorder);
            });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível cancelar.', 'OK', {
        duration: 2000,
      });
    }
  }

  async onSubmit() {
    try {
      if (this.orcamentoForm.valid) {
        const formValue = this.orcamentoForm.value as IWorkOrder;

        const workOrderEntity = Object.assign(new WorkOrderEntity(), formValue);
        workOrderEntity.products = JSON.stringify(workOrderEntity.products);
        workOrderEntity.services = JSON.stringify(workOrderEntity.services);

        if (!this.id.value) {
          delete workOrderEntity.id;
        }

        await this._databaseService
          .connection
          .then(async () => {
            const saveResult = await workOrderEntity.save();
            this.id.patchValue(saveResult.id);

            if (this.orcamentoForm.controls.status.value === this.STATUS.Canceled
              || this.orcamentoForm.controls.status.value === this.STATUS.Finished) {
              this.orcamentoForm.disable();
            }

            this._snackBar.open('Salvo com sucesso.', 'OK', {
              duration: 2000,
            });
          });
      }
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível salvar.', 'OK', {
        duration: 2000,
      });
    }
  }
}
