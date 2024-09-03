import { Component, Inject, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import {
  creditCardRegex,
  cvcRegex,
  dniRegex,
  expirationDateRegex,
} from '../../../utils/utils';
import { League } from '../../../models/league';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { TicketService } from '../../../services/ticket.service';
import { User } from '../../../models/user';
import { formatDate } from '../../../utils/shared-functions';

@Component({
  selector: 'app-pay-league-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    MatIcon,
    MatButton,
  ],
  templateUrl: './pay-league-modal.component.html',
  styleUrls: ['./pay-league-modal.component.scss'],
})
export class PayLeagueModalComponent {
  private router = Inject(Router);
  private snackbarService = inject(SnackbarService);
  private dialogRef = inject(MatDialogRef<PayLeagueModalComponent>);
  private ticketService = inject(TicketService);
  private localStorageService = inject(LocalStorageService);

  /**
   * Pay form
   */
  public payForm: FormGroup;

  /**
   * User data
   */
  public userData!: User;

  /**
   * Pay error text
   */
  payErrorText = 'Ha habido un problema al pagar la liga, intentelo más tarde';

  /**
   * Pay error text
   */
  payInProgressText =
    'El pago está en proceso, si quiere ver el estado de dicho ticket vaya a la sección de Mis Tickets';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { league: League; snackbar: boolean },
  ) {
    this.userData = this.localStorageService.getItem('user');
    this.payForm = new FormGroup({
      dni: new FormControl('', [
        Validators.required,
        Validators.pattern(dniRegex),
      ]),
      direction: new FormControl('', Validators.required),
      numberCard: new FormControl('', [
        Validators.required,
        Validators.pattern(creditCardRegex),
      ]),
      expirationCard: new FormControl('', [
        Validators.required,
        Validators.pattern(expirationDateRegex),
      ]),
      cvcCard: new FormControl('', [
        Validators.required,
        Validators.pattern(cvcRegex),
      ]),
    });
  }

  goToProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  payLeague(): void {
    const formattedDate = formatDate(new Date());
    const tickets = this.localStorageService.getItem('tickets');
    if (this.payForm.valid) {
      const cvc = this.payForm.get('cvcCard')?.value;
      if (cvc.startsWith('1')) {
        this.ticketService
          .createTicket(
            this.data.league.id,
            this.userData.id as number,
            'REJECTED',
            formattedDate,
          )
          .subscribe((ticket) => {
            tickets.push(ticket);
            this.localStorageService.setItem('tickets', tickets);
          });

        if (this.data.snackbar) {
          this.snackbarService.openSnackBar(this.payErrorText, 'warning');
        }

        this.dialogRef.close();
      }
      else if(cvc.startsWith('2')) {
        this.ticketService
          .createTicket(
            this.data.league.id,
            this.userData.id as number,
            'INPROGRESS',
            formattedDate,
          )
          .subscribe((ticket) => {
            tickets.push(ticket);
            this.localStorageService.setItem('tickets', tickets);
          });

        if (this.data.snackbar) {
          this.snackbarService.openSnackBar(this.payInProgressText, 'warning');
        }

        this.dialogRef.close();
      } else {
        this.ticketService
          .createTicket(
            this.data.league.id,
            this.userData.id as number,
            'PAID',
            formattedDate,
          )
          .subscribe((ticket) => {
            tickets.push(ticket);
            this.localStorageService.setItem('tickets', tickets);
          });
        this.dialogRef.close('yes');
      }
    }
  }
}
