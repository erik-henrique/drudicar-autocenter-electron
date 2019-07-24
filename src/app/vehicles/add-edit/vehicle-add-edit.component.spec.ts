import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAddEditComponent } from './vehicle-add-edit.component';

describe('AddEditComponent', () => {
  let component: VehicleAddEditComponent;
  let fixture: ComponentFixture<VehicleAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
