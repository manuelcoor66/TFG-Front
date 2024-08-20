import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Matches } from '../../../models/matches';
import { League } from '../../../models/league';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { fourPlayers } from '../../../utils/shared-functions';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatchesService } from '../../../services/matches.service';
import { catchError, EMPTY } from 'rxjs';
import { SnackbarService } from '../../../services/snackbar.service';
import { SportsService } from '../../../services/sports.service';
import { Sport } from '../../../models/sports';

@Component({
  selector: 'app-add-match-result',
  standalone: true,
  imports: [
    MatCheckbox,
    MatRadioGroup,
    MatRadioButton,
    FormsModule,
    NgIf,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
  ],
  templateUrl: './add-match-result.component.html',
  styleUrls: ['./add-match-result.component.scss'],
})
export class AddMatchResultComponent {
  private matchService = inject(MatchesService);
  private dialogRef = inject(MatDialogRef<AddMatchResultComponent>);
  private snackbarService = inject(SnackbarService);
  private sportService = inject(SportsService);

  selectedOption: string | null = null;

  /**
   * League form
   */
  public resultForm: FormGroup;

  /**
   * Sport player
   */
  sport!: Sport;

  /**
   *
   * @param data
   */

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { match: Matches; league: League },
  ) {
    this.resultForm = new FormGroup({
      result: new FormControl('', Validators.required),
    });
    console.log(this.data.league);
    this.sportService
      .getSportByName(this.data.league.sport)
      .subscribe((sport) => {
        this.sport = sport;
      });
  }

  addResult(): void {
    if (
      this.resultForm.valid &&
      this.selectedOption !== null &&
      this.selectedOption !== undefined
    ) {
      if (this.sport.players == 4) {
        if (this.selectedOption == 'option1') {
          this.matchService
            .addMatchResult(
              this.data.match.id,
              this.resultForm.get('result')?.value,
              true,
              true,
              false,
              false,
            )
            .pipe(
              catchError((err) => {
                this.snackbarService.openSnackBar(err.error.message, 'warning');
                throw err;
              }),
            )
            .subscribe(() => {
              this.dialogRef.close(this.resultForm.get('result')?.value);
            });
        } else if (this.selectedOption == 'option2') {
          this.matchService
            .addMatchResult(
              this.data.match.id,
              this.resultForm.get('result')?.value,
              false,
              false,
              true,
              true,
            )
            .pipe(
              catchError((err) => {
                this.snackbarService.openSnackBar(err.error.message, 'warning');
                throw err;
              }),
            )
            .subscribe(() => {
              this.dialogRef.close(this.resultForm.get('result')?.value);
            });
        }
      } else if (this.sport.players == 2) {
        if (this.selectedOption == 'option1') {
          this.matchService
            .addMatchResult(
              this.data.match.id,
              this.resultForm.get('result')?.value,
              true,
              false,
            )
            .pipe(
              catchError((err) => {
                this.snackbarService.openSnackBar(err.error.message, 'warning');
                throw err;
              }),
            )
            .subscribe(() => {
              this.dialogRef.close(this.resultForm.get('result')?.value);
            });
        } else if (this.selectedOption == 'option2') {
          this.matchService
            .addMatchResult(
              this.data.match.id,
              this.resultForm.get('result')?.value,
              false,
              true,
            )
            .pipe(
              catchError((err) => {
                this.snackbarService.openSnackBar(err.error.message, 'warning');
                throw err;
              }),
            )
            .subscribe(() => {
              this.dialogRef.close(this.resultForm.get('result')?.value);
            });
        }
      }
    }
  }

  protected readonly fourPlayers = fourPlayers;
}
