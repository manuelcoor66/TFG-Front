import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeSecurityWordModalComponent } from './change-security-word-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ChangeSecurityWordModalComponent', () => {
  let component: ChangeSecurityWordModalComponent;
  let fixture: ComponentFixture<ChangeSecurityWordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChangeSecurityWordModalComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeSecurityWordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
