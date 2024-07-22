import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { EnrolmentService } from '../../../services/enrolment.service';
import { League } from '../../../models/league';
import { LeagueService } from '../../../services/league.service';
import { MatButton } from '@angular/material/button';
import { SnackbarService } from '../../../services/snackbar.service';
import { User } from '../../../models/user';
import { catchError } from 'rxjs';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Enrolment } from '../../../models/enrolment';
import { NgForOf, NgIf } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { DomSanitizer } from '@angular/platform-browser';
import {
  MatTab,
  MatTabContent,
  MatTabGroup,
  MatTabLabel,
} from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { GeneralModalComponent } from '../../shared-components/general-modal/general-modal.component';
import { UserTableComponent } from '../user-table/user-table.component';
import { MatchesList } from '../../../models/matches';
import { MatchesService } from '../../../services/matches.service';
import { fourPlayers } from '../../../utils/shared-functions';

@Component({
  selector: 'app-league-detail',
  standalone: true,
  imports: [
    MatButton,
    NgIf,
    MatIconModule,
    MatMenuTrigger,
    MatMenu,
    MatTab,
    MatTabContent,
    MatTabGroup,
    MatTabLabel,
    UserTableComponent,
    NgForOf,
  ],
  templateUrl: './league-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./league-detail.component.scss'],
})
export class LeagueDetailComponent implements OnInit {
  private leagueService = inject(LeagueService);
  private route = inject(ActivatedRoute);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private enrolmentService = inject(EnrolmentService);
  private localStorageService = inject(LocalStorageService);
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);
  private dialog = inject(MatDialog);
  private matchesService = inject(MatchesService);

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

  /**
   * Finalized league matches
   */
  finalizedMatches?: MatchesList;

  /**
   * Finalized league matches
   */
  activeMatches!: MatchesList;

  showMessage = false;

  constructor() {
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/delete.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit.svg'),
    );

    this.route.params.subscribe((params) => {
      this.matchesService
        .getActiveLeagueMatches(params['id'])
        .subscribe((matches) => {
          this.finalizedMatches = matches;
        });

      this.matchesService
        .getFinalizedLeagueMatches(params['id'])
        .subscribe((matches) => {
          this.activeMatches = matches;
        });
    });
  }

  ngOnInit(): void {
    this.currentUser = this.localStorageService.getItem('user');
    this.enrolments = this.localStorageService.getItem('enrolments');

    this.route.params.subscribe((params) => {
      this.isEnroled = this.enrolments?.some(
        (element) => element.leagueId == params['id'],
      ) as boolean;
      this.leagueId = params['id'];
      this.leagueService
        .getLeagueById(params['id'])
        .pipe(
          catchError((err) => {
            this.snackbarService.openSnackBar(err.error.message, 'warning');
            throw err;
          }),
        )
        .subscribe((league) => {
          this.leagueDetail = league;
        });
    });
  }

  goToLeagues(): void {
    this.router.navigateByUrl('/leagues');
  }

  isEnrolled(): boolean {
    return this.enrolments?.some(
      (element) => element.leagueId == this.leagueId,
    ) as boolean;
  }

  isCreator(): boolean {
    return this.leagueDetail?.createdById == this.currentUser?.id;
  }

  deleteLeague() {
    const dialogRef = this.dialog.open(GeneralModalComponent, {
      width: '36rem',
      data: { forgotPassword: false },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data && data == 'yes') {
        this.leagueService
          .deleteLeagueById(this.leagueId)
          .pipe(
            catchError((err) => {
              this.snackbarService.openSnackBar(err.error.message, 'warning');
              throw err;
            }),
          )
          .subscribe(() => {
            let leagues = this.localStorageService.getItem('leagues');
            leagues.splice(this.leagueDetail, 1);
            this.localStorageService.setItem('leagues', leagues);

            this.router.navigateByUrl('/leagues');
            this.snackbarService.openSnackBar(
              'Liga eliminada con éxito',
              'success',
            );
          });
      }
    });
  }

  enrolOnLeague(): void {
    if (this.leagueDetail?.id && this.currentUser?.id) {
      this.enrolmentService
        .createEnrolment(this.leagueDetail?.id, this.currentUser?.id, false)
        .pipe(
          catchError((err) => {
            this.snackbarService.openSnackBar(err.error.message, 'warning');
            throw err;
          }),
        )
        .subscribe((enrolment) => {
          this.isEnroled = true;
          this.enrolments?.push(enrolment);
          this.localStorageService.setItem(
            'enrolments',
            this.enrolments as Enrolment[],
          );
          this.snackbarService.openSnackBar(
            'Usuario matriculado con éxito',
            'success',
          );
        });
    }
  }

  deleteEnrolment(): void {
    if (this.leagueDetail?.id && this.currentUser?.id) {
      this.enrolmentService
        .finalizeEnrolment(this.leagueDetail?.id, this.currentUser?.id)
        .pipe(
          catchError((err) => {
            this.snackbarService.openSnackBar(err.error.message, 'warning');
            throw err;
          }),
        )
        .subscribe((enrolments) => {
          this.isEnroled = false;
          this.localStorageService.setItem('enrolments', enrolments.items);
          this.snackbarService.openSnackBar(
            'Usuario desmatriculado con éxito',
            'success',
          );
        });
    }
  }

  isStarted(): boolean {
    if (this.leagueDetail) return this.leagueDetail?.dateStart < new Date();

    return false;
  }

  weeksLeft(): number {
    if (this.leagueDetail)
      return this.leagueDetail?.weeks - this.leagueDetail?.weeksPlayed;

    return 0;
  }

  getMonth(): number {
    if (this.leagueDetail)
      return this.leagueDetail?.dateStart.getMonth() + 1;

    return 0;
  }

  protected readonly fourPlayers = fourPlayers;
}
