import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAddEditComponent } from './client-add-edit.component';

describe('AddEditComponent', () => {
  let component: ClientAddEditComponent;
  let fixture: ComponentFixture<ClientAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
