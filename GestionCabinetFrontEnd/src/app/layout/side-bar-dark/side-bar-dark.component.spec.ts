import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarDarkComponent } from './side-bar-dark.component';

describe('SideBarDarkComponent', () => {
  let component: SideBarDarkComponent;
  let fixture: ComponentFixture<SideBarDarkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideBarDarkComponent]
    });
    fixture = TestBed.createComponent(SideBarDarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
