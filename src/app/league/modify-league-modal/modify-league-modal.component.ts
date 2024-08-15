import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { League } from '../../../models/league';
import { LeagueService } from '../../../services/league.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-modify-league-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: './modify-league-modal.component.html',
  styleUrls: ['./modify-league-modal.component.scss'],
})
export class ModifyLeagueModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ModifyLeagueModalComponent>);
  private leagueService = inject(LeagueService);
  private snackbarService = inject(SnackbarService);

  /**
   * League form
   */
  public leagueForm: FormGroup;

  /**
   * Actual leagues
   */
  actualLeagues!: League[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { league: League },
    private localStorageService: LocalStorageService, // Inyección correcta
  ) {
    this.leagueForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.data.league) {
      this.leagueForm.patchValue({
        name: this.data.league.name,
        description: this.data.league.description,
      });
    }

    this.actualLeagues = this.localStorageService.getItem('leagues');
  }

  modifyLeague(): void {
    const index = this.actualLeagues.findIndex(
      (lg) => lg.id === this.data.league.id,
    );
    this.actualLeagues[index].name = this.leagueForm.get('name')?.value;
    this.actualLeagues[index].description =
      this.leagueForm.get('description')?.value;

    this.localStorageService.setItem('leagues', this.actualLeagues);

    const dateStart = new Date(this.actualLeagues[index].dateStart);
    this.leagueService
      .modifyLeague(this.actualLeagues[index], dateStart)
      .pipe(
        catchError((err) => {
          this.snackbarService.openSnackBar(err.error.message, 'warning');
          throw err;
        }),
      )
      .subscribe();

    this.dialogRef.close();
  }
}
