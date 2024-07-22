import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFactComponent } from './pdf-fact.component';

describe('PdfFactComponent', () => {
  let component: PdfFactComponent;
  let fixture: ComponentFixture<PdfFactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfFactComponent]
    });
    fixture = TestBed.createComponent(PdfFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
