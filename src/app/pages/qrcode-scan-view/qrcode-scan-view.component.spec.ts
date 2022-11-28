import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeScanViewComponent } from './qrcode-scan-view.component';

describe('QrcodeScanViewComponent', () => {
  let component: QrcodeScanViewComponent;
  let fixture: ComponentFixture<QrcodeScanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeScanViewComponent ]
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
