import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserStateModalComponent } from './change-user-state-modal.component';

describe('ChangeUserStateModalComponent', () => {
  let component: ChangeUserStateModalComponent;
  let fixture: ComponentFixture<ChangeUserStateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeUserStateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeUserStateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
