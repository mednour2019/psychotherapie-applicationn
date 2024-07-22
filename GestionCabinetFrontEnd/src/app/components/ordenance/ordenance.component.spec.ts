import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenanceComponent } from './ordenance.component';

describe('OrdenanceComponent', () => {
  let component: OrdenanceComponent;
  let fixture: ComponentFixture<OrdenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdenanceComponent]
    });
    fixture = TestBed.createComponent(OrdenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
