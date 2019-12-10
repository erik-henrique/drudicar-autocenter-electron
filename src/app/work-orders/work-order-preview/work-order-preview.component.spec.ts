import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderPreviewComponent } from './work-order-preview.component';

describe('WorkOrderPreviewComponent', () => {
  let component: WorkOrderPreviewComponent;
  let fixture: ComponentFixture<WorkOrderPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkOrderPreviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
