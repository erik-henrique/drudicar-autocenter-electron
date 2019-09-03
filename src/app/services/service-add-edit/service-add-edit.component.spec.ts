import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAddEditComponent } from './service-add-edit.component';

describe('AddEditComponent', () => {
  let component: ServiceAddEditComponent;
  let fixture: ComponentFixture<ServiceAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
