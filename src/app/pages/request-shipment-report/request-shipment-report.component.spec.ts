import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestShipmentReportComponent } from './request-shipment-report.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShipStatusPipe } from 'app/pipe/ship-status.pipe';

describe('RequestShipmentReportComponent', () => {
  let component: RequestShipmentReportComponent;
  let fixture: ComponentFixture<RequestShipmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule, NgbModule ],
      declarations: [ RequestShipmentReportComponent, ShipStatusPipe ]
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
