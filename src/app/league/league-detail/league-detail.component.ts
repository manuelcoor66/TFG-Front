import { ActivatedRoute, Router } from '@angular/router';
import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit} from '@angular/core';
import { EnrolmentService } from '../../../services/enrolment.service';
import { League } from '../../../models/league';
import { LeagueService } from '../../../services/league.service';
import { MatButton } from '@angular/material/button';
import { SnackbarService } from '../../../services/snackbar.service';
import { User } from '../../../models/user';
import { catchError } from 'rxjs';
import {LocalStorageService} from "../../../services/local-storage.service";
import {Enrolment} from "../../../models/enrolment";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-league-detail',
  standalone: true,
  imports: [
    MatButton,
    NgIf,
    MatIconModule
  ],
  templateUrl: './league-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './league-detail.component.scss',
})
export class LeagueDetailComponent implements OnInit {
  private leagueService = inject(LeagueService);
  private route = inject(ActivatedRoute);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private enrolmentService = inject(EnrolmentService);
  private localStorageService = inject(LocalStorageService);

  /**
   * League detail data
   */
  leagueDetail?: League;

  /**
   * Current user data
   */
  currentUser?: User;

  /**
   * User enrolments
   */
  enrolments?: Enrolment[];

  /**
   * Whetever the user is enrolled on the league
   */
  isEnroled? = false;

  /**
   * League id
   */
  leagueId = 0;

  ngOnInit(): void {
    this.currentUser = this.localStorageService.getItem('user');
    this.enrolments = this.localStorageService.getItem('enrolments');

    this.route.params.subscribe((params) => {
      this.isEnroled = this.enrolments?.some(element => element.leagueId == params['id']) as boolean
      this.leagueId = params['id'];
      this.leagueService.getLeagueById(params['id'])
        .pipe(
          catchError((err) => {
            this.snackbarService.openSnackBar(err.error.message, 'warning');
            throw err;
          })
        )
        .subscribe((league) => {
          this.leagueDetail = league;
        });
    });
  }

  goToLeagues(): void {
    this.router.navigateByUrl('/leagues')
  }

  isEnrolled(): boolean {
    return this.enrolments?.some(element => element.leagueId == this.leagueId) as boolean
  }

  enrolOnLeague(): void {
    if (this.leagueDetail?.id && this.currentUser?.id) {
      this.enrolmentService.createEnrolment(this.leagueDetail?.id, this.currentUser?.id, false)
      .pipe(
        catchError((err) => {
          this.snackbarService.openSnackBar(err.error.message, 'warning');
          throw err;
        }),
      )
      .subscribe((enrolment) => {
        this.isEnroled = true;
        this.enrolments?.push(enrolment);
        this.localStorageService.setItem('enrolments', this.enrolments as Enrolment[])
        this.snackbarService.openSnackBar('Usuario matriculado con éxito', 'success');
      })
    }
  }

  deleteEnrolment(): void {
    if (this.leagueDetail?.id && this.currentUser?.id) {
      this.enrolmentService.finalizeEnrolment(this.leagueDetail?.id, this.currentUser?.id)
      .pipe(
        catchError((err) => {
          this.snackbarService.openSnackBar(err.error.message, 'warning');
          throw err;
        }),
      )
      .subscribe((enrolments) => {
        this.isEnroled = false;
        this.localStorageService.setItem('enrolments', enrolments.items)
        this.snackbarService.openSnackBar('Usuario desmatriculado con éxito', 'success');
      })
    }
  }
}
