import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestShipmentManageComponent } from './request-shipment-manage.component';

describe('RequestShipmentManageComponent', () => {
  let component: RequestShipmentManageComponent;
  let fixture: ComponentFixture<RequestShipmentManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestShipmentManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestShipmentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
