import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAddEditComponent } from './work-order-add-edit.component';

describe('AddEditComponent', () => {
  let component: WorkOrderAddEditComponent;
  let fixture: ComponentFixture<WorkOrderAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkOrderAddEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
