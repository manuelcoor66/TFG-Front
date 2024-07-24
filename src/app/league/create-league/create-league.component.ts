import { Component, inject } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MatOption,
  MatSelect,
  MatSelectModule,
} from '@angular/material/select';
import { LeagueService } from '../../../services/league.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Place } from '../../../models/places';
import { PlacesService } from '../../../services/places.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { Sport } from '../../../models/sports';
import { SportsService } from '../../../services/sports.service';

@Component({
  selector: 'app-create-league',
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
  providers: [DatePipe],
  templateUrl: './create-league.component.html',
  styleUrls: ['./create-league.component.scss'],
})
export class CreateLeagueComponent {
  private snackbarService = inject(SnackbarService);
  private leagueService = inject(LeagueService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);
  private placesService = inject(PlacesService);
  private sportsService = inject(SportsService);

  /**
   * Login form
   */
  public leagueForm: FormGroup;

  /**
   * points that can earn the winner
   */
  pointsVictoryOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  /**
   * points that can earn the loser
   */
  pointsDefeatOptions = [1, 2, 3, 4, 5, 6];

  /**
   * points that can earn the loser
   */
  weeksLeagueOptions = [4, 5, 6, 7, 8, 9, 10];

  /**
   * All the places
   */
  places?: Place[];

  /**
   * All the places
   */
  sports?: Sport[];

  constructor() {
    this.leagueForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      pointsVictory: new FormControl('', Validators.required),
      pointsDefeat: new FormControl('', Validators.required),
      place: new FormControl('', Validators.required),
      sport: new FormControl('', Validators.required),
      weeks: new FormControl('', Validators.required),
      dateStart: new FormControl('', Validators.required),
    });

    this.placesService.getAllPlaces().subscribe((places) => {
      this.places = places.items;
    });

    this.sportsService.getAllSports().subscribe((sports) => {
      this.sports = sports.items;
    });
  }

  createLeague(): void {
    if (this.leagueForm.valid) {
      if (
        this.leagueForm.get('pointsVictory')?.value >
        this.leagueForm.get('pointsDefeat')?.value
      ) {
        const formattedDate = this.formatDate(
          this.leagueForm.get('dateStart')?.value,
        );
        const user = this.localStorageService.getItem('user');
        this.leagueService
          .createLeague(
            this.leagueForm.get('name')?.value,
            this.leagueForm.get('description')?.value,
            user.id,
            this.leagueForm.get('pointsVictory')?.value,
            this.leagueForm.get('pointsDefeat')?.value,
            this.leagueForm.get('weeks')?.value,
            formattedDate,
            this.leagueForm.get('place')?.value,
            this.leagueForm.get('sport')?.value,
          )
          .subscribe(() => {
            this.router.navigateByUrl('/leagues');
          });
      } else {
        this.snackbarService.openSnackBar(
          'Los puntos por victoria deben de ser mayores que los puntos por derrota',
          'warning',
        );
      }
    }
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }
}
