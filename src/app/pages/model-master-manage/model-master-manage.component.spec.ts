import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelMasterManageComponent } from './model-master-manage.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ModelMasterManageComponent', () => {
  let component: ModelMasterManageComponent;
  let fixture: ComponentFixture<ModelMasterManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelMasterManageComponent],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, NgbModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelMasterManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
