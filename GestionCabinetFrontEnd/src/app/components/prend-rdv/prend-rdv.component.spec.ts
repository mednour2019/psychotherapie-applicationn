import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrendRdvComponent } from './prend-rdv.component';

describe('PrendRdvComponent', () => {
  let component: PrendRdvComponent;
  let fixture: ComponentFixture<PrendRdvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrendRdvComponent]
    });
    fixture = TestBed.createComponent(PrendRdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
