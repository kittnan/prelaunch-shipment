import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminLayoutComponent } from './admin-layout.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FixedPluginModule } from 'app/shared/fixedplugin/fixedplugin.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminLayoutComponent],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, NgbModule, FixedPluginModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
