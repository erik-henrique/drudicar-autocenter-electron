import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import IService from '../../shared/interfaces/service.interface';
import { DatabaseService } from '../../shared/services/database/database.service';
import { ServiceEntity } from '../../shared/services/database/entities/service.entity';
import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Like } from 'typeorm';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {
  public serviceFilterForm: FormGroup;
  public services: IService[];

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.serviceFilterForm = this._fb.group({
      name: ''
    });

    this.serviceFilterForm.controls.name.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe(async (value: string) => {
        try {
          this.spinner.show();
          await this._databaseService.connection
            .then(async () => {
              if (typeof value === 'string') {
                const services = await ServiceEntity.find({
                  name: Like(`%${value}%`)
                });
                this.services = services as IService[];
              }
            })
            .finally(() => {
              this.spinner.hide();
            });
        } catch (err) {
          console.error(err);
          this._snackBar.open(
            'Não foi possível carregar os serviços filtrados.',
            'OK',
            {
              duration: 2000
            }
          );
        }
      });

    await this.getServices();
  }

  public goToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  async getServices() {
    try {
      this.spinner.show();
      await this._databaseService.connection
        .then(async () => {
          const services = await ServiceEntity.find();
          this.services = services as IService[];
        })
        .finally(() => {
          this.spinner.hide();
        });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível carregar os serviços.', 'OK', {
        duration: 2000
      });
    }
  }

  async deleteService(service: IService) {
    try {
      const confirmation = {
        message: 'Deseja desativar o serviço',
        data: service.name,
        action: 'Desativar'
      };

      const dialogRef = this.dialog.open(ConfirmationComponent, {
        minWidth: '25%',
        minHeight: '25%',
        data: { ...confirmation }
      });

      dialogRef.afterClosed().subscribe(async data => {
        if (data) {
          await this._databaseService.connection.then(async () => {
            await ServiceEntity.update({ id: service.id }, { status: false });
            await this.getServices();
          });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível desativar o serviço.', 'OK', {
        duration: 2000
      });
    }
  }
}
