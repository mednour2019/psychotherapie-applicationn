import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCheckboxgroupComponent } from './generic-checkboxgroup.component';

describe('GenericCheckboxgroupComponent', () => {
  let component: GenericCheckboxgroupComponent;
  let fixture: ComponentFixture<GenericCheckboxgroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericCheckboxgroupComponent]
    });
    fixture = TestBed.createComponent(GenericCheckboxgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
