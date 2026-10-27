import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelReportComponent } from './label-report.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LabelReportTableComponent } from 'app/pages/label-report/label-report-table/label-report-table.component';
import { SearchbarComponent } from 'app/shared/searchbar/searchbar.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LabelReportComponent', () => {
  let component: LabelReportComponent;
  let fixture: ComponentFixture<LabelReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabelReportComponent, LabelReportTableComponent, SearchbarComponent],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, NgbModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
