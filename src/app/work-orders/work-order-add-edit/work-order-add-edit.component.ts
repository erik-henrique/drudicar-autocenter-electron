import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
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
      label: 'Finalizada', value: 'Finalizada'
    },
    {
      label: 'Disponível', value: 'Disponível'
    },
  ];

  public orcamentoForm: FormGroup;
  public clients: IClient[];
  public vehicles: IVehicle[];
  public servicos: IService[];

  public STATUS = Status;
  public WORK_ORDER_TYPES = WorkOrderTypes;

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService) {
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
      servicos: this._fb.array([], Validators.required),
      produtos: this._fb.array([]),
      status: 'Aguardando Aprovação',
      tipo: ['Orçamento', Validators.required],
      observacoes: null,
      dataPagamento: null,
      formaPagamento: null,
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

  get servicoForms() {
    return this.orcamentoForm.get('servicos') as FormArray;
  }

  addService() {
    const servico = this._fb.group({
      nome: [null, Validators.required],
      preco: null
    });

    this.servicoForms.push(servico);
  }

  deleteService(i) {
    this.servicoForms.removeAt(i);
  }

  get produtoForms() {
    return this.orcamentoForm.get('produtos') as FormArray;
  }

  addProduct() {
    const produto = this._fb.group({
      nome: [null, Validators.required],
      preco: null
    });

    this.produtoForms.push(produto);
  }

  deleteProduct(i) {
    this.produtoForms.removeAt(i);
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
    return this.orcamentoForm.get('tipo');
  }

  filterServices(value: string): Boolean {
    return this.servicos.find(s => s.nome === value) ? false : true;
  }

  get valorTotal() {
    const produtos = this.orcamentoForm.get('produtos') as FormArray;
    const servicos = this.orcamentoForm.get('servicos') as FormArray;

    if (!produtos.value.length && !servicos.value.length) {
      return 0;
    }

    if (produtos.value.length && !servicos.value.length) {
      return parseFloat(produtos.value
        .map(value => value.preco)
        .reduce((accum, curr) => accum + curr));
    }

    if (!produtos.value.length && servicos.value.length) {
      return parseFloat(servicos.value
        .map(value => value.preco)
        .reduce((accum, curr) => accum + curr));
    }

    return parseFloat(produtos.value
      .map(value => value.preco)
      .reduce((accum, curr) => accum + curr) + servicos.value
        .map(value => value.preco)
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
    }
  }

  async getServices() {
    try {
      this.spinner.show();

      await this._databaseService
        .connection
        .then(async () => {
          const clients = await ServiceEntity.find({ status: true });
          this.servicos = clients as IService[];
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
          const workOrder = await WorkOrderEntity.findOne(id, { relations: ['vehicle', 'vehicle.client'] });
          const servicos = JSON.parse(workOrder.servicos) as any[];
          const produtos = JSON.parse(workOrder.produtos) as any[];

          delete workOrder.servicos;
          delete workOrder.produtos;

          servicos.forEach(s => this.servicoForms.push(this._fb.group({
            nome: [s.nome, Validators.required],
            preco: s.preco
          })));

          produtos.forEach(p => this.produtoForms.push(this._fb.group({
            nome: [p.nome, Validators.required],
            preco: p.preco
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

          if (this.orcamentoForm.controls.status.value === this.STATUS.Cancelada
            || this.orcamentoForm.controls.status.value === this.STATUS.Finalizada) {
            this.orcamentoForm.disable();
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  async cancelWorkOrder() {
    try {
      const orcamento = this.orcamentoForm.value as IWorkOrder;

      const confirmation = {
        message: 'Tem certeza que deseja cancelar o',
        data: `${orcamento.tipo} Nº ${orcamento.id}`,
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
              await WorkOrderEntity.update({ id: orcamento.id }, { status: this.STATUS.Cancelada });
              this.orcamentoForm.controls.status.setValue(this.STATUS.Cancelada);
              this.orcamentoForm.disable();
            });
        }
      });
    } catch (err) {
      console.error(err);
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
                .update({ id: orcamento.id }, { status: this.STATUS.Disponivel, tipo: this.WORK_ORDER_TYPES.OrdemDeServico });
              this.orcamentoForm.controls.status.setValue(this.STATUS.Disponivel);
              this.orcamentoForm.controls.tipo.setValue(this.WORK_ORDER_TYPES.OrdemDeServico);
            });
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async onSubmit() {
    try {
      if (this.orcamentoForm.valid) {
        const formValue = this.orcamentoForm.value as IWorkOrder;

        const workOrderEntity = Object.assign(new WorkOrderEntity(), formValue);
        workOrderEntity.produtos = JSON.stringify(workOrderEntity.produtos);
        workOrderEntity.servicos = JSON.stringify(workOrderEntity.servicos);

        if (!this.id.value) {
          delete workOrderEntity.id;
        }

        await this._databaseService
          .connection
          .then(async () => {
            const saveResult = await workOrderEntity.save();
            this.id.patchValue(saveResult.id);

            if (this.orcamentoForm.controls.status.value === this.STATUS.Cancelada
              || this.orcamentoForm.controls.status.value === this.STATUS.Finalizada) {
              this.orcamentoForm.disable();
            }
          });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
