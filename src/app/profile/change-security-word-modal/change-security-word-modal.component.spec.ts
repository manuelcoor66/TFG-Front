import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSecurityWordModalComponent } from './change-security-word-modal.component';

describe('ChangeSecurityWordModalComponent', () => {
  let component: ChangeSecurityWordModalComponent;
  let fixture: ComponentFixture<ChangeSecurityWordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeSecurityWordModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeSecurityWordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
