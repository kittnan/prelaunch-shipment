import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestShipmentManageComponent } from './request-shipment-manage.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ShipStatusPipe } from 'app/pipe/ship-status.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RequestShipmentManageComponent', () => {
  let component: RequestShipmentManageComponent;
  let fixture: ComponentFixture<RequestShipmentManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestShipmentManageComponent, ShipStatusPipe],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, NgbModule, ToastrModule.forRoot()],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
