import { TestBed } from '@angular/core/testing';

import { DropDownSharedMethodsService } from './drop-down-shared-methods.service';

describe('DropDownSharedMethodsService', () => {
  let service: DropDownSharedMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropDownSharedMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
