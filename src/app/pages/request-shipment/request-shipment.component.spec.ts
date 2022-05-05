import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestShipmentComponent } from './request-shipment.component';

describe('RequestShipmentComponent', () => {
  let component: RequestShipmentComponent;
  let fixture: ComponentFixture<RequestShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
