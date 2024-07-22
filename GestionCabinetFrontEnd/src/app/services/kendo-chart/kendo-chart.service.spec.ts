import { TestBed } from '@angular/core/testing';

import { KendoChartService } from './kendo-chart.service';

describe('KendoChartService', () => {
  let service: KendoChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KendoChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
