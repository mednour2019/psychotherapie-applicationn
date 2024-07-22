import { TestBed } from '@angular/core/testing';

import { SharedApiMethodsService } from './shared-api-methods.service';

describe('SharedApiMethodsService', () => {
  let service: SharedApiMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedApiMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
