import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { VehicleAddEditComponent } from './add-edit/vehicle-add-edit.component';
import IVehicle from '../../shared/interfaces/vehicle.interface';
import { DatabaseService } from '../../shared/services/database/database.service';
import { VehicleEntity } from '../../shared/services/database/entities/vehicle.entity';
import { ConfirmationComponent } from '../../shared/components/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss']
})
export class VehiclesListComponent implements OnInit {
  displayedColumns: string[] = [
    'carLicense',
    'model',
    'brand',
    'color',
    'year',
    'yearModel',
    'state',
    'district',
    'chassis',
    'edit',
    'delete'];

  public dataSource = new MatTableDataSource<IVehicle>();

  @ViewChild(MatPaginator, null) paginator: MatPaginator;

  @Input() clientId: number;

  constructor(
    private dialog: MatDialog,
    private _databaseService: DatabaseService,
    private _snackBar: MatSnackBar) { }

  async ngOnInit() {
    await this.getVehicles();
  }

  async getVehicles() {
    try {
      await this._databaseService
        .connection
        .then(async () => {
          const vehicles = await VehicleEntity.find({ where: { client: this.clientId } });
          this.dataSource.data = vehicles;
          this.dataSource.paginator = this.paginator;
        });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível carregar o veículo.', 'OK', {
        duration: 2000,
      });
    }
  }

  async activateVehicle(vehicle: IVehicle) {
    try {
      const confirmation = {
        message: 'Deseja ativar o veículo',
        data: vehicle.carLicense.toUpperCase().substr(0, 3) + '-' + vehicle.carLicense.substr(3),
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
              await VehicleEntity.update({ id: vehicle.id }, { status: true });
              await this.getVehicles();
            });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível ativar o veículo.', 'OK', {
        duration: 2000,
      });
    }
  }

  async deleteVehicle(vehicle: IVehicle) {
    try {
      const confirmation = {
        message: 'Deseja desativar o veículo',
        data: vehicle.carLicense.toUpperCase().substr(0, 3) + '-' + vehicle.carLicense.substr(3),
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
              await VehicleEntity.update({ id: vehicle.id }, { status: false });
              await this.getVehicles();
            });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível desativar o veículo.', 'OK', {
        duration: 2000,
      });
    }
  }

  editOrAddVehicle(vehicle?: IVehicle): void {
    try {
      const dialogRef = this.dialog.open(VehicleAddEditComponent, {
        minWidth: '75%',
        minHeight: '75%',
        data: { ...vehicle, client: this.clientId }
      });

      dialogRef.afterClosed().subscribe(async () => {
        await this.getVehicles();
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open(`Não foi possível ir para ${vehicle.id ? 'editar' : 'adicionar'} o veículo`, 'OK', {
        duration: 2000,
      });
    }
  }
}
