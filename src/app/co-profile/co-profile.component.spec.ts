import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoProfileComponent } from './co-profile.component';

describe('CoProfileComponent', () => {
  let component: CoProfileComponent;
  let fixture: ComponentFixture<CoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
