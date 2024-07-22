import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFilterPeriodComponent } from './date-filter-period.component';

describe('DateFilterPeriodComponent', () => {
  let component: DateFilterPeriodComponent;
  let fixture: ComponentFixture<DateFilterPeriodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateFilterPeriodComponent]
    });
    fixture = TestBed.createComponent(DateFilterPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
