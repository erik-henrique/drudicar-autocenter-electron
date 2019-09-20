import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
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
  public servicos: IService[];

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
      servicos: this._fb.array([]),
      produtos: this._fb.array([]),
      status: '',
      observacoes: '',
      dataPagamento: '',
      formaPagamento: '',
      valor: null
    });

    // setInterval(() => {
    //   console.log(this.servicoForms.controls[0].value)
    // }, 1000)

    this.orcamentoForm.controls.client.valueChanges
      .pipe(distinctUntilChanged()).subscribe(async (value: number) => {
        try {
          console.log('client', value);
          this.spinner.show();
          await this._databaseService
            .connection
            .then(async () => {
              if (typeof value === 'number') {
                const vechicles = await VehicleEntity.find({ where: { clientId: value } });
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

  get vehicleId() {
    return this.orcamentoForm.get('vehicle');
  }

  get statusFromForm() {
    return this.orcamentoForm.get('status');
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

          this.orcamentoForm.controls.client.patchValue(workOrder.vehicle.client.id);
          this.orcamentoForm.controls.vehicle.patchValue(workOrder.vehicle.id);
        });
    } catch (err) {
      console.error(err);
    }
  }

  // async deactivateWorkOrder() {
  //   try {
  //     const servico = this.orcamentoForm.value as IWorkOrder;

  //     const confirmation = {
  //       message: 'Tem certeza que deseja desativar o serviço',
  //       data: servico.,
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
  //             await WorkOrderEntity.update({ id: servico.id }, { status: false });
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
  //     const servico = this.orcamentoForm.value as IWorkOrder;

  //     const confirmation = {
  //       message: 'Tem certeza que deseja ativar o serviço',
  //       data: servico.nome,
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
  //             await WorkOrderEntity.update({ id: servico.id }, { status: true });
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
        workOrderEntity.produtos = JSON.stringify(workOrderEntity.produtos);
        workOrderEntity.servicos = JSON.stringify(workOrderEntity.servicos);

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
