import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestShipmentReportComponent } from './request-shipment-report.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShipStatusPipe } from 'app/pipe/ship-status.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RequestShipmentReportComponent', () => {
  let component: RequestShipmentReportComponent;
  let fixture: ComponentFixture<RequestShipmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestShipmentReportComponent, ShipStatusPipe],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, NgbModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
