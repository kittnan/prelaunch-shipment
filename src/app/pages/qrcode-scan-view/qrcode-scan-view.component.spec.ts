import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeScanViewComponent } from './qrcode-scan-view.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QrcodeScanTableComponent } from 'app/pages/qrcode-scan/qrcode-scan-table/qrcode-scan-table.component';
import { BoxStatusPipe } from 'app/pipe/box-status.pipe';
import { ShipStatusPipe } from 'app/pipe/ship-status.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('QrcodeScanViewComponent', () => {
  let component: QrcodeScanViewComponent;
  let fixture: ComponentFixture<QrcodeScanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrcodeScanViewComponent, QrcodeScanTableComponent, BoxStatusPipe, ShipStatusPipe],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, NgbModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeScanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
