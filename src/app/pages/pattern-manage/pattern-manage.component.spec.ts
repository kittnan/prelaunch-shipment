import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternManageComponent } from './pattern-manage.component';

describe('PatternManageComponent', () => {
  let component: PatternManageComponent;
  let fixture: ComponentFixture<PatternManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
