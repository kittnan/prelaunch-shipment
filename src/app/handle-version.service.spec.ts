import { TestBed } from '@angular/core/testing';

import { HandleVersionService } from './handle-version.service';

describe('HandleVersionService', () => {
  let service: HandleVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
