import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehicle-add-edit',
  templateUrl: './vehicle-add-edit.component.html',
  styleUrls: ['./vehicle-add-edit.component.scss']
})
export class VehicleAddEditComponent implements OnInit {
  public vehicleForm: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.vehicleForm = this._fb.group({
      placa: ['', [
        Validators.required
      ]],
      cor: [''],
      modelo: [''],
      marca: [''],
      ano: [''],
      anoModelo: [''],
      uf: [''],
      municipio: [''],
      chassi: ['']
    });

    this.vehicleForm.controls.placa.valueChanges.subscribe(async (value: string) => {
      console.log(value.length);
      console.log(value);
      if (value.length === 7) {
        // this.findClientZipCode(value);
      }
    });
  }

  get placa() {
    return this.vehicleForm.get('placa');
  }

  get nome() {
    return this.vehicleForm.get('placa');
  }
}
