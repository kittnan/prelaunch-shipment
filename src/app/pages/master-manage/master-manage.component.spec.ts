import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterManageComponent } from './master-manage.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MasterManageComponent', () => {
  let component: MasterManageComponent;
  let fixture: ComponentFixture<MasterManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterManageComponent],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, NgbModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
