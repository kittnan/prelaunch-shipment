import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeScanViewComponent } from './qrcode-scan-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QrcodeScanTableComponent } from 'app/pages/qrcode-scan/qrcode-scan-table/qrcode-scan-table.component';
import { BoxStatusPipe } from 'app/pipe/box-status.pipe';
import { ShipStatusPipe } from 'app/pipe/ship-status.pipe';

describe('QrcodeScanViewComponent', () => {
  let component: QrcodeScanViewComponent;
  let fixture: ComponentFixture<QrcodeScanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule, NgbModule ],
      declarations: [ QrcodeScanViewComponent, QrcodeScanTableComponent, BoxStatusPipe, ShipStatusPipe ]
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
