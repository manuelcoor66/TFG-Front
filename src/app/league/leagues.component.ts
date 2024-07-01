import { Component, OnInit, inject } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LeagueList } from '../../models/league';
import { LeagueService } from '../../services/league.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { UserService } from '../../services/user.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [NgForOf, NgIf, RouterLink],
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss'],
})
export class LeaguesComponent implements OnInit {
  private leagueService = inject(LeagueService);
  private localStorageService = inject(LocalStorageService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private userService = inject(UserService);

  /**
   * leagues
   */
  leagues?: LeagueList;

  ngOnInit(): void {
    this.leagueService
      .getAllLeagues()
      .pipe(
        catchError((err) => {
          this.snackbarService.openSnackBar(err.error.message);
          throw err;
        }),
      )
      .subscribe((leagues) => {
        this.leagues = leagues;
        this.localStorageService.setItem('leagues', leagues.items);
      });
  }

  goToLeagueDetail(id: number): void {
    this.router.navigateByUrl('/league/' + id);
  }
}
