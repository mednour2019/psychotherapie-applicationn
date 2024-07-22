import { TestBed } from '@angular/core/testing';

import { OrdenanceService } from './ordenance.service';

describe('OrdenanceService', () => {
  let service: OrdenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
