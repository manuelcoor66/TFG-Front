import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyLeagueModalComponent } from './modify-league-modal.component';

describe('ModifyLeagueModalComponent', () => {
  let component: ModifyLeagueModalComponent;
  let fixture: ComponentFixture<ModifyLeagueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyLeagueModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyLeagueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
