import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MatOption,
  MatSelect,
  MatSelectModule,
} from '@angular/material/select';
import { League } from '../../../models/league';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatchesService } from '../../../services/matches.service';
import { PlacesService } from '../../../services/places.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-add-match-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    NgForOf,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    DatePipe,
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  templateUrl: './add-match-modal.component.html',
  styleUrls: ['./add-match-modal.component.scss'],
})
export class AddMatchModalComponent {
  private snackbarService = inject(SnackbarService);
  private matchService = inject(MatchesService);
  private placeService = inject(PlacesService);
  private localStorageService = inject(LocalStorageService);
  private dialogRef = inject(MatDialogRef<AddMatchModalComponent>);
  private cdRef = inject(ChangeDetectorRef);

  /**
   * Match form
   */
  public matchForm: FormGroup;

  /**
   * Current user data
   */
  currentUser?: User;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { league: League }) {
    this.matchForm = new FormGroup({
      date: new FormControl('', Validators.required),
      hour: new FormControl('', Validators.required),
    });

    this.currentUser = this.localStorageService.getItem('user');
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate = event.value;
    this.matchForm.get('date')?.setValue(selectedDate);
    this.cdRef.detectChanges();
  }

  addMatch(): void {
    if (this.matchForm.valid) {
      const date = new Date(this.matchForm.get('date')?.value);
      const [hours, minutes] = this.matchForm
        .get('hour')
        ?.value.split(':')
        .map(Number);
      date.setHours(hours, minutes, 0, 0);

      const now = new Date();
      const timeDiff: number = date.getTime() - now.getTime();
      const diffInDays: number = timeDiff / (24 * 60 * 60 * 1000);

      const startDate = new Date(this.data.league.dateStart);
      const weeksInMilliseconds =
        this.data.league.weeks * 7 * 24 * 60 * 60 * 1000;
      const oneDay = 24 * 60 * 60 * 1000;
      const twoHours = 2 * 60 * 60 * 1000;
      const endDate = new Date(
        startDate.getTime() + weeksInMilliseconds + oneDay - twoHours - 1000,
      );
      const day = ('0' + endDate.getDate()).slice(-2);
      const month = ('0' + (endDate.getMonth() + 1)).slice(-2);
      const year = endDate.getFullYear().toString().slice(-2);

      const endDateToShow = `${day}/${month}/${year}`;

      if (diffInDays < 1) {
        this.snackbarService.openSnackBar(
          'La fecha del partido tiene que ser como mínimo dentro de 24 horas',
          'warning',
        );
      } else if (date.getTime() > endDate.getTime()) {
        this.snackbarService.openSnackBar(
          `La fecha del partido tiene que ser antes de la fecha máxima (${endDateToShow})`,
          'warning',
        );
      } else {
        this.placeService
          .getPlaceByName(this.data.league.place)
          .subscribe((place) => {
            this.matchService
              .createMatch(
                this.data.league.id,
                this.currentUser?.id as number,
                date,
                place.id,
              )
              .subscribe((match) => {
                this.dialogRef.close(match);
              });
          });
      }
    }
  }
}
