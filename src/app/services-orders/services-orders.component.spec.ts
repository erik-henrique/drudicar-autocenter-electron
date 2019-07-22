import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesOrdersComponent } from './services-orders.component';

describe('ServicesOrdersComponent', () => {
  let component: ServicesOrdersComponent;
  let fixture: ComponentFixture<ServicesOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
