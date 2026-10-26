import { TestBed } from '@angular/core/testing';

import { HandleVersionService } from './handle-version.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('HandleVersionService', () => {
  let service: HandleVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ]
    });
    service = TestBed.inject(HandleVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
