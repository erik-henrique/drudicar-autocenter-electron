import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import IVehicle from '../../../shared/interfaces/vehicle.interface';
import { DatabaseService } from '../../../shared/services/data-access/database.service';
import { VehicleEntity } from '../../../shared/services/data-access/entities/vehicle.entity';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-vehicle-add-edit',
  templateUrl: './vehicle-add-edit.component.html',
  styleUrls: ['./vehicle-add-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class VehicleAddEditComponent implements OnInit {
  public vehicleForm: FormGroup;

  @ViewChild('ano', null) datePickerAno: MatDatepicker<Date>;
  @ViewChild('anoModelo', null) datePickerAnoModelo: MatDatepicker<Date>;

  public minDate = new Date(1970, 0, 1);
  public maxDate = new Date(2022, 0, 1);

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<VehicleAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IVehicle,
    private _databaseService: DatabaseService) { }

  ngOnInit() {
    this.vehicleForm = this._fb.group({
      placa: ['',
        Validators.required
      ],
      cor: '',
      modelo: '',
      marca: '',
      ano: '',
      anoModelo: '',
      uf: '',
      municipio: '',
      chassi: '',
      status: true,
      id: '',
      client: ''
    });

    if (this.data) {
      this.vehicleForm.patchValue(this.data);
    }
  }

  get placa() {
    return this.vehicleForm.get('placa');
  }

  get ano() {
    return this.vehicleForm.get('ano');
  }

  closeAnoDatePicker(event: any) {
    this.vehicleForm.controls.ano.patchValue(new Date(event));
    this.datePickerAno.close();
  }

  closeAnoModeloDatePicker(event: any) {
    this.vehicleForm.controls.anoModelo.patchValue(new Date(event));
    this.datePickerAnoModelo.close();
  }

  async onSubmit() {
    try {
      if (this.vehicleForm.valid) {
        const formValue = this.vehicleForm.value as IVehicle;
        const vehicleEntity = Object.assign(new VehicleEntity(), formValue);

        if (!vehicleEntity.id) {
          delete vehicleEntity.id;
        }

        if (!vehicleEntity.ano) {
          delete vehicleEntity.ano;
        } else {
          vehicleEntity.ano = new Date(vehicleEntity.ano);
        }

        if (!vehicleEntity.anoModelo) {
          delete vehicleEntity.anoModelo;
        } else {
          vehicleEntity.anoModelo = new Date(vehicleEntity.anoModelo);
        }

        await this._databaseService
          .connection
          .then(async () => {
            await vehicleEntity.save();
            this.dialogRef.close();
          });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
