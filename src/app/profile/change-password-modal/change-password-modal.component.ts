import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { catchError } from 'rxjs';
import { matchValidator } from '../../utils/functions';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent {
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService);
  private localStorageService = inject(LocalStorageService);
  private dialog = inject(MatDialog);

  /**
   * Login form
   */
  public loginForm!: FormGroup;

  /**
   * actual user data
   */
  public actualUser!: User;

  constructor() {
    this.actualUser = this.localStorageService.getItem('user');

    this.loginForm = new FormGroup({
      oldPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        matchValidator('newPasswordRepeat', true),
        // matchValidator(user.password as string, true),
      ]),
      newPasswordRepeat: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        matchValidator('newPassword'),
      ]),
    });
  }

  changePassword(): void {
    if (this.loginForm.valid) {
      if (
        this.actualUser.password == this.loginForm.get('oldPassword')?.value
      ) {
        this.userService
          .changePassword(
            this.actualUser.email as string,
            this.loginForm.get('newPassword')?.value,
          )
          .pipe(
            catchError((err) => {
              this.snackbarService.openSnackBar(err.error.message);
              throw err;
            }),
          )
          .subscribe();
        this.actualUser.password = this.loginForm.get('newPassword')?.value;
        this.dialog.closeAll();
      } else {
        this.snackbarService.openSnackBar(
          'La contraseña actual no existe o la introducida es la actual',
        );
      }
    }
  }
}
