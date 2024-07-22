import { Component, OnInit, inject } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LeagueList } from '../../models/league';
import { LeagueService } from '../../services/league.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { catchError } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { User } from '../../models/user';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [NgForOf, NgIf, RouterLink, MatButton],
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

  ngOnInit(): void {
    this.leagueService
      .getAllLeagues()
      .pipe(
        catchError((err) => {
          this.snackbarService.openSnackBar(err.error.message, 'warning');
          throw err;
        }),
      )
      .subscribe((leagues) => {
        this.leagues = leagues;
        this.localStorageService.setItem('leagues', leagues.items);
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
