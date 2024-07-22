import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertErrorComponent } from './alert-error.component';

describe('AlertErrorComponent', () => {
  let component: AlertErrorComponent;
  let fixture: ComponentFixture<AlertErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertErrorComponent]
    });
    fixture = TestBed.createComponent(AlertErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
