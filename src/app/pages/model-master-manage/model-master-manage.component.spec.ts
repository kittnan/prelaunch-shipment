import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelMasterManageComponent } from './model-master-manage.component';

describe('ModelMasterManageComponent', () => {
  let component: ModelMasterManageComponent;
  let fixture: ComponentFixture<ModelMasterManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelMasterManageComponent ]
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
