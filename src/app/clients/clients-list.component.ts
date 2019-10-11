import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Like } from 'typeorm';
import { NgxSpinnerService } from 'ngx-spinner';

import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';
import { DatabaseService } from '../../shared/services/database/database.service';
import { ClientEntity } from '../../shared/services/database/entities/client.entity';
import IClient from '../../shared/interfaces/client.interface';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  public clients: IClient[];
  public clientFilterForm: FormGroup;

  constructor(
    private _databaseService: DatabaseService,
    private dialog: MatDialog,
    private _fb: FormBuilder,
    private spinner: NgxSpinnerService) {
  }

  async ngOnInit() {
    this.clientFilterForm = this._fb.group({
      name: null,
      individualRegistration: null
    });

    this.clientFilterForm.controls.name.valueChanges.pipe(debounceTime(2000), distinctUntilChanged()).subscribe(async (value: string) => {
      try {
        this.spinner.show();
        await this._databaseService
          .connection
          .then(async () => {
            if (typeof value === 'string') {
              this.clientFilterForm.controls.individualRegistration.reset();
              const clients = await ClientEntity.find({ name: Like(`%${value}%`) });
              this.clients = clients as IClient[];
            }
          }).finally(() => {
            this.spinner.hide();
          });
      } catch (err) {
        console.error(err);
      }
    });

    this.clientFilterForm.controls.individualRegistration.valueChanges.pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe(async (value: string) => {
        try {
          this.spinner.show();
          await this._databaseService
            .connection
            .then(async () => {
              if (typeof value === 'string') {
                this.clientFilterForm.controls.name.reset();
                const clients = await ClientEntity.find({ individualRegistration: Like(`%${value}%`) });
                this.clients = clients as IClient[];
              }
            }).finally(() => {
              this.spinner.hide();
            });
        } catch (err) {
          console.error(err);
        }
      });

    await this.getClients();
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

  public goToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async deleteClient(client: IClient) {
    try {
      const confirmation = {
        message: 'Tem certeza que deseja desativar o cliente',
        data: client.name,
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
              await this.getClients();
            });
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
}
