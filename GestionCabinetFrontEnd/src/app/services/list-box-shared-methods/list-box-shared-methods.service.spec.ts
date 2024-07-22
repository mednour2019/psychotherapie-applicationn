import { TestBed } from '@angular/core/testing';

import { ListBoxSharedMethodsService } from './list-box-shared-methods.service';

describe('ListBoxSharedMethodsService', () => {
  let service: ListBoxSharedMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListBoxSharedMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
