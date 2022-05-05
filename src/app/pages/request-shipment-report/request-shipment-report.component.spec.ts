import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestShipmentReportComponent } from './request-shipment-report.component';

describe('RequestShipmentReportComponent', () => {
  let component: RequestShipmentReportComponent;
  let fixture: ComponentFixture<RequestShipmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestShipmentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestShipmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
