import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentsTableComponent } from './enrolments-table.component';

describe('UserTableComponent', () => {
  let component: EnrolmentsTableComponent;
  let fixture: ComponentFixture<EnrolmentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolmentsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrolmentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
