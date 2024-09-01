import { Component, OnInit, inject } from '@angular/core';
import { League, LeagueList } from '../../models/league';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LeagueService } from '../../services/league.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoDataComponent } from '../shared-components/no-data/no-data.component';
import { SnackbarService } from '../../services/snackbar.service';
import { User } from '../../models/user';
import { UserRole } from '../../utils/enum';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    MatButton,
    MatIcon,
    NoDataComponent,
    NgClass,
    MatTooltipModule,
    FormsModule,
    MatInput,
  ],
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss'],
})
export class LeaguesComponent implements OnInit {
  private leagueService = inject(LeagueService);
  private localStorageService = inject(LocalStorageService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);

  /**
   * league list data
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
   * Search terms
   */
  searchTerm: string = '';

  /**
   * Message to show if there are no data
   */
  emptyData =
    'No se existen ligas en activo actualmente, si quiere apuntarse a una, va a tener que crearla ' +
    'en el botón de arriba a la derecha';

  ngOnInit(): void {
    this.loadLeagues();
    this.currentUser = this.localStorageService.getItem('user');
  }

  loadLeagues(): void {
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
  }

  goToLeagueDetail(league: League): void {
    if (league.weeksPlayed < league.weeks) {
      this.router.navigateByUrl('/league/' + league.id);
    }
  }

  createLeague(): void {
    this.router.navigateByUrl('/create-league');
  }

  applyFilter(): void {
    this.leagues = { items: [], total: 0 };

    this.leagueService
      .getAllLeagues(this.searchTerm)
      .pipe(
        catchError((err) => {
          this.isEmpty = true;
          throw err;
        }),
      )
      .subscribe((leagues) => {
        this.leagues = leagues;
        this.localStorageService.setItem('leagues', leagues.items);
        this.isEmpty = leagues.total === 0;
      });
  }

  showDeletedLeague(league: League): boolean {
    const show: Date = new Date();
    const milisegundosEnSemana = 7 * 24 * 60 * 60 * 1000;
    show.setTime(
      league.dateStart.getTime() +
        milisegundosEnSemana * league.weeks +
        4 * milisegundosEnSemana,
    );
    const now = new Date();

    return league.weeksPlayed < league.weeks ? true : show > now;
  }

  showLeague(league: League): boolean {
    const now = new Date();

    return league.dateStart > now ? true : this.showDeletedLeague(league);
  }

  protected readonly userRole = UserRole;
}
