import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayLeagueModalComponent } from './pay-league-modal.component';

describe('PayLeagueModalComponent', () => {
  let component: PayLeagueModalComponent;
  let fixture: ComponentFixture<PayLeagueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayLeagueModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PayLeagueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
