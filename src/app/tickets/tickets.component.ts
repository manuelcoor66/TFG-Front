import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { NgClass, NgForOf, NgStyle } from '@angular/common';
import { UserTicket, UserTicketList } from '../../models/ticket';
import { LeagueService } from '../../services/league.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatChip } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { PayLeagueModalComponent } from '../league/pay-league-modal/pay-league-modal.component';
import { TicketService } from '../../services/ticket.service';
import { TicketState } from '../../utils/enum';
import { User } from '../../models/user';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [NgForOf, MatChip, NgStyle, NgClass],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  private ticketService = inject(TicketService);
  private localStorageService = inject(LocalStorageService);
  private leagueService = inject(LeagueService);
  private dialog = inject(MatDialog);
  private cdRef = inject(ChangeDetectorRef);

  /**
   * Actual user data
   */
  actualUser!: User;

  /**
   * User tickets
   */
  userTickets: UserTicketList = { items: [], total: 0 };

  ngOnInit(): void {
    this.actualUser = this.localStorageService.getItem('user');
    this.ticketService
      .getUserTicket(this.actualUser.id as number)
      .subscribe((tickets) => {
        this.userTickets = tickets;
        this.localStorageService.setItem('tickets', tickets.items);
      });
  }

  getDate(ticket: UserTicket): string {
    return `${ticket.date.getDay()}/${ticket.date.getMonth() + 1}/${ticket.date.getFullYear()}`;
  }

  getTicketStateValue(state: TicketState): string {
    return TicketState[state as unknown as keyof typeof TicketState];
  }

  getColorForState(state: TicketState): string {
    if (
      TicketState[state as unknown as keyof typeof TicketState] ===
      TicketState.PAID
    ) {
      return '#4caf50';
    } else if (
      TicketState[state as unknown as keyof typeof TicketState] ===
      TicketState.INPROGRESS
    ) {
      return '#f0e68c';
    } else {
      return '#f44336';
    }
  }

  getTicketState(state: TicketState): TicketState {
    return TicketState[state as unknown as keyof typeof TicketState];
  }

  paidLeague(ticket: UserTicket): void {
    if (this.getTicketState(ticket.state) === TicketState.REJECTED) {
      this.leagueService
        .getLeagueByName(ticket.leagueName)
        .subscribe((league) => {
          if (league.id && this.actualUser?.id) {
            const dialogRef = this.dialog.open(PayLeagueModalComponent, {
              width: '36rem',
              data: {
                league: league,
                snackbar: false,
              },
            });
            dialogRef.afterClosed().subscribe(() => {
              window.location.reload();
            });
          }
        });
    }
  }

  protected readonly ticketState = TicketState;
}
