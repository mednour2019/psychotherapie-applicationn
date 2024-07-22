import { TestBed } from '@angular/core/testing';

import { GridSharedMethodsService } from './grid-shared-methods.service';

describe('GridSharedMethodsService', () => {
  let service: GridSharedMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridSharedMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
