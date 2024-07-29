import { Component, OnInit, inject } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LeagueList } from '../../models/league';
import { LeagueService } from '../../services/league.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NoDataComponent } from '../shared-components/no-data/no-data.component';
import { SnackbarService } from '../../services/snackbar.service';
import { User } from '../../models/user';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [NgForOf, NgIf, RouterLink, MatButton, MatIcon, NoDataComponent],
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss'],
})
export class LeaguesComponent implements OnInit {
  private leagueService = inject(LeagueService);
  private localStorageService = inject(LocalStorageService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);

  /**
   * leagues
   */
  leagues?: LeagueList;

  /**
   * Current user data
   */
  currentUser?: User;

  /**
   * Whether is empty
   */
  isEmpty = true;

  /**
   * Empty active data text
   */
  emptyData =
    'No se existen ligas en activo actualmente, si quiere apuntarse a una, va a tener que ' +
    'crearla en el botón de arriba a la derecha';

  ngOnInit(): void {
    this.leagueService
      .getAllLeagues()
      .pipe(
        catchError((err) => {
          this.snackbarService.openSnackBar(err.error.message, 'warning');
          this.isEmpty = true;
          throw err;
        }),
      )
      .subscribe((leagues) => {
        this.leagues = leagues;
        this.localStorageService.setItem('leagues', leagues.items);
        this.isEmpty = leagues.total === 0;
      });

    this.currentUser = this.localStorageService.getItem('user');
  }

  goToLeagueDetail(id: number): void {
    this.router.navigateByUrl('/league/' + id);
  }

  createLeague(): void {
    this.router.navigateByUrl('/create-league');
  }
}
