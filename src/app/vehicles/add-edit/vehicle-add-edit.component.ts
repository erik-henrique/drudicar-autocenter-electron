import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import {
  MatDatepicker,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';

import IVehicle from '../../../shared/interfaces/vehicle.interface';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { VehicleEntity } from '../../../shared/services/database/entities/vehicle.entity';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-vehicle-add-edit',
  templateUrl: './vehicle-add-edit.component.html',
  styleUrls: ['./vehicle-add-edit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class VehicleAddEditComponent implements OnInit {
  public vehicleForm: FormGroup;

  @ViewChild('year', null) datePickerAno: MatDatepicker<Date>;
  @ViewChild('yearModel', null) datePickerAnoModelo: MatDatepicker<Date>;

  public minDate = new Date(1970, 0, 1);
  public maxDate = new Date(2022, 0, 1);

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<VehicleAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IVehicle,
    private _databaseService: DatabaseService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.vehicleForm = this._fb.group({
      carLicense: ['', Validators.required],
      color: '',
      model: '',
      brand: '',
      year: '',
      yearModel: '',
      state: '',
      district: '',
      chassis: '',
      status: true,
      id: '',
      client: ''
    });

    if (this.data) {
      this.vehicleForm.patchValue(this.data);
    }
  }

  get carLicense() {
    return this.vehicleForm.get('carLicense');
  }

  get year() {
    return this.vehicleForm.get('year');
  }

  get id() {
    return this.vehicleForm.get('id');
  }

  closeAnoDatePicker(event: any) {
    this.vehicleForm.controls.year.patchValue(new Date(event));
    this.datePickerAno.close();
  }

  closeAnoModeloDatePicker(event: any) {
    this.vehicleForm.controls.yearModel.patchValue(new Date(event));
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

        if (!vehicleEntity.year) {
          delete vehicleEntity.year;
        } else {
          vehicleEntity.year = new Date(vehicleEntity.year);
        }

        if (!vehicleEntity.yearModel) {
          delete vehicleEntity.yearModel;
        } else {
          vehicleEntity.yearModel = new Date(vehicleEntity.yearModel);
        }

        await this._databaseService.connection.then(async () => {
          await vehicleEntity.save();
          this._snackBar.open('Veículo salvo com sucesso.', 'OK', {
            duration: 2000
          });
          this.dialogRef.close();
        });
      }
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível salvar o veículo.', 'OK', {
        duration: 2000
      });
    }
  }
}
