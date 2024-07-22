import { TestBed } from '@angular/core/testing';

import { KendoDialogSharedMethodsService } from './kendo-dialog-shared-methods.service';

describe('KendoDialogSharedMethodsService', () => {
  let service: KendoDialogSharedMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KendoDialogSharedMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
