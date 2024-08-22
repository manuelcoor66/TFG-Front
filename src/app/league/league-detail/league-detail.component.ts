import {ActivatedRoute, Router} from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {catchError, EMPTY} from 'rxjs';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatTab, MatTabContent, MatTabGroup, MatTabLabel,} from '@angular/material/tabs';
import {Matches, MatchesList} from '../../../models/matches';
import {NgForOf, NgIf} from '@angular/common';
import {AddMatchResultComponent} from '../add-match-result/add-match-result.component';
import {DomSanitizer} from '@angular/platform-browser';
import {Enrolment} from '../../../models/enrolment';
import {EnrolmentService} from '../../../services/enrolment.service';
import {GeneralModalComponent} from '../../shared-components/general-modal/general-modal.component';
import {League} from '../../../models/league';
import {LeagueService} from '../../../services/league.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatchesService} from '../../../services/matches.service';
import {ModifyLeagueModalComponent} from '../modify-league-modal/modify-league-modal.component';
import {NoDataComponent} from '../../shared-components/no-data/no-data.component';
import {PayLeagueModalComponent} from '../pay-league-modal/pay-league-modal.component';
import {SnackbarService} from '../../../services/snackbar.service';
import {TicketState} from '../../../utils/enum';
import {User} from '../../../models/user';
import {UserTableComponent} from '../user-table/user-table.component';
import {UserTicket} from '../../../models/ticket';
import {fourPlayers} from '../../../utils/shared-functions';
import {Sport} from "../../../models/sports";
import {SportsService} from "../../../services/sports.service";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AddMatchModalComponent} from "../add-match-modal/add-match-modal.component";

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
    NoDataComponent,
    MatTooltipModule,
  ],
  templateUrl: './league-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./league-detail.component.scss'],
})
export class LeagueDetailComponent implements OnInit, OnDestroy {
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
  private cdRef = inject(ChangeDetectorRef);
  private sportService = inject(SportsService);

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
  finalizedMatches!: MatchesList;

  /**
   * Finalized league matches
   */
  activeMatches!: MatchesList;

  /**
   * Whether to show message
   */
  showMessage = false;

  /**
   * Whether is empty the actives matches
   */
  isEmptyActive = true;

  /**
   * Whether is empty the finalized matches
   */
  isEmptyFinalized = true;

  /**
   * User tickets
   */
  userTickets!: UserTicket[];

  /**
   * League sport
   */
  sport!: Sport;

  /**
   * New match to add
   */
  new_match!: Matches;

  /**
   * Empty active data text
   */
  emptyActiveData =
    'No se encuentran partidos en activo, si quiere apuntarse a uno, va a tener que crearlo ' +
    'en el botón de arriba a la derecha';

  /**
   * Empty finalized data text
   */
  emptyFinalizedData =
    'Todavía no se ha terminado ningún partido de esta liga, si quiere ver los partidos vaya a la primera pestaña';

  /**
   * Delete league title
   */
  deleteLeagueTitle = 'Borrar liga';

  /**
   * Delete league text
   */
  deleteLeagueText =
    '¿Estás seguro de que quieres borrar la liga? Si lo haces todos los usuarios perderán su ' +
    'suscripción y sus registros.';

  /**
   * Delete league title
   */
  deleteEnrolmentTitle = 'Desmatricularse';

  /**
   * Delete league text
   */
  deleteEnrolmentText =
    '¿Estás seguro de que quieres desmatricularte? Si lo haces no podrás recuperar el dinero pagado y si quieres ' +
    'volver a matricularte tendrás que volver a pagar de nuevo.';

  @ViewChild(UserTableComponent) userTable!: UserTableComponent;

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
        .pipe(
          catchError(() => {
            this.isEmptyActive = true;

            return EMPTY;
          }),
        )
        .subscribe((matches) => {
          this.activeMatches = matches;
          this.isEmptyActive = matches.total === 0;
        });

      this.matchesService
        .getFinalizedLeagueMatches(params['id'])
        .pipe(
          catchError(() => {
            this.isEmptyFinalized = true;

            return EMPTY;
          }),
        )
        .subscribe((matches) => {
          this.finalizedMatches = matches;
          this.isEmptyFinalized = matches.total === 0;
        });
    });
  }

  ngOnInit(): void {
    this.currentUser = this.localStorageService.getItem('user');
    this.userTickets = this.localStorageService.getItem('tickets');

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

          this.sportService
            .getSportByName(league.sport)
            .subscribe((sport) => {
              this.sport = sport;
            });

          const startDate: Date = new Date(league.dateStart);
          const currentDate: Date = new Date();
          const timeDifference: number = currentDate.getTime() - startDate.getTime();
          league.weeksPlayed = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
          this.leagueService.modifyLeague(league, league.dateStart)
        });
    });

    this.enrolmentService
      .getLeagueEnrolments(this.leagueId)
      .subscribe((enrolments) => {
        this.enrolments = enrolments.items;
        this.localStorageService.setItem('enrolments', enrolments.items);
      });
  }

  ngOnDestroy(): void {
    this.localStorageService.removeItem('enrolments');
  }

  goToLeagues(): void {
    this.router.navigateByUrl('/leagues');
  }

  isEnrolled(): boolean {
    const validTicket = this.userTickets?.some(
      (element) =>
        TicketState[element.state as unknown as keyof typeof TicketState],
    ) as boolean;
    const enrolled = this.enrolments?.some(
      (element) => element.userId == this.currentUser?.id,
    ) as boolean;

    return validTicket && enrolled;
  }

  isCreator(): boolean {
    return this.leagueDetail?.createdById == this.currentUser?.id;
  }

  deleteLeague(): void {
    const dialogRef = this.dialog.open(GeneralModalComponent, {
      width: '36rem',
      data: {
        title: this.deleteLeagueTitle,
        text: this.deleteLeagueText,
      },
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
            const leagues = this.localStorageService.getItem('leagues');
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

  editLeague(): void {
    const dialogRef = this.dialog.open(ModifyLeagueModalComponent, {
      width: '36rem',
      data: {
        league: this.leagueDetail,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.leagueService.getLeagueById(this.leagueId).subscribe((league) => {
        this.leagueDetail = league;
        this.cdRef.detectChanges();
      });
    });
  }

  enrolOnLeague(): void {
    if (this.leagueDetail?.id && this.currentUser?.id) {
      const dialogRef = this.dialog.open(PayLeagueModalComponent, {
        width: '36rem',
        data: {
          league: this.leagueDetail,
          snackbar: true,
        },
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data && data == 'yes') {
          this.enrolmentService
            .createEnrolment(
              this.leagueDetail?.id as number,
              this.currentUser?.id as number,
              false,
            )
            .pipe(
              catchError((err) => {
                this.snackbarService.openSnackBar(err.error.message, 'warning');
                throw err;
              }),
            )
            .subscribe((enrolment) => {
              this.isEnroled = true;
              this.userTable.refreshData();

              if (!this.enrolments) {
                this.enrolments = [];
              }
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
      });
    }
  }

  deleteEnrolment(): void {
    if (this.leagueDetail?.id && this.currentUser?.id) {
      const dialogRef = this.dialog.open(GeneralModalComponent, {
        width: '36rem',
        data: {
          title: this.deleteEnrolmentTitle,
          text: this.deleteEnrolmentText,
        },
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data && data == 'yes') {
          this.enrolmentService
            .finalizeEnrolment(
              this.leagueDetail?.id as number,
              this.currentUser?.id as number,
            )
            .pipe(
              catchError((err) => {
                this.snackbarService.openSnackBar(err.error.message, 'warning');
                throw err;
              }),
            )
            .subscribe((enrolments) => {
              this.isEnroled = false;
              this.userTable.refreshData();

              this.localStorageService.setItem('enrolments', enrolments.items);
              this.snackbarService.openSnackBar(
                'Usuario desmatriculado con éxito',
                'success',
              );

              this.enrolments = enrolments.items;
              this.cdRef.detectChanges();
            });
        }
      });
    }
  }

  getDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const year = String(date.getFullYear()).slice(-2); // Obtener los últimos dos dígitos del año
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  matchFull(match: Matches): boolean {
    const players = [match.playerName1, match.playerName2, match.playerName3, match.playerName4];
    const filledPlayers = players.filter(Boolean).length;

    return filledPlayers === this.sport.players
  }

  canEnrol(match: Matches): boolean {
    const players = [match.playerName1, match.playerName2, match.playerName3, match.playerName4];
    const filledPlayers = players.filter(Boolean).length;

    return filledPlayers < this.sport.players;
  }

  canCreate(): boolean {
  const fullName = `${this.currentUser?.name ?? ''} ${this.currentUser?.lastNames ?? ''}`.trim().toLowerCase();

  const exists = this.activeMatches.items.some(match => {
    const playerNames = [
      match.playerName1,
      match.playerName2,
      match.playerName3,
      match.playerName4
    ].filter(name => name !== undefined && name !== null);

    return playerNames.some(playerName =>
      playerName?.toLowerCase().trim() === fullName
    );
  });

  return !exists;
}

  createMatch(): void {
    const dialogRef = this.dialog.open(AddMatchModalComponent, {
      width: '36rem',
      data: {
        league: this.leagueDetail,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        data.date = new Date(data.date)
        data.playerName1 = this.currentUser?.name + ' ' + this.currentUser?.lastNames
        this.activeMatches.items.push(data);
        this.cdRef.detectChanges();
      }
    });
  }

  addPlayer(match: Matches): void {
    this.matchesService.addPlayer(match.id, this.currentUser?.id as number).subscribe();
    this.matchesService
        .getActiveLeagueMatches(this.leagueDetail?.id as number)
        .pipe(
          catchError(() => {
            this.isEmptyActive = true;

            return EMPTY;
          }),
        )
        .subscribe((matches) => {
          this.activeMatches = matches;
          this.cdRef.detectChanges();
        });
  }

  isPlayer(match: Matches): boolean {
    const fullname = this.currentUser?.name + ' ' + this.currentUser?.lastNames;

    return [
      match.playerName1,
      match.playerName2,
      match.playerName3,
      match.playerName4,
    ].includes(fullname);
  }

  openAddMatchResult(match: Matches): void {
    const dialogRef = this.dialog.open(AddMatchResultComponent, {
      width: '36rem',
      data: {
        match: match,
        league: this.leagueDetail,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const indexToEdit = this.finalizedMatches?.items.findIndex(
          (m) => m.id === match.id,
        );
        this.enrolmentService
          .getLeagueEnrolments(this.leagueDetail?.id as number)
          .pipe(
            catchError((err) => {
              this.snackbarService.openSnackBar(err.error.message, 'warning');
              throw err;
            }),
          )
          .subscribe((enrolments) => {
            this.localStorageService.setItem('enrolments', enrolments.items);
            this.enrolments = enrolments.items;
            this.userTable.refreshData();
          });
        this.finalizedMatches.items[indexToEdit as number].result = data;
        this.cdRef.detectChanges();
      }
    });
  }

  isStarted(): boolean {
    if (this.leagueDetail) {
      return this.leagueDetail?.dateStart < new Date();
    }

    return false;
  }

  weeksLeft(): number {
    if (this.leagueDetail) {
      return this.leagueDetail?.weeks - this.leagueDetail?.weeksPlayed;
    }

    return 0;
  }

  getMonth(): number {
    if (this.leagueDetail) {
      return this.leagueDetail?.dateStart.getMonth() + 1;
    }

    return 0;
  }

  protected readonly fourPlayers = fourPlayers;
}
