import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestShipmentComponent } from './request-shipment.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RequestShipmentComponent', () => {
  let component: RequestShipmentComponent;
  let fixture: ComponentFixture<RequestShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestShipmentComponent],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, NgbModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
